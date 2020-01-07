const request = require('request');
const querystring = require('querystring');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const STATE_KEY = process.env.SPOTIFY_STATE_KEY;
const REDIRECT_URI = `http://localhost:${process.env.PORT + process.env.REST_PATH}/callback`;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = (app) => {
    // application requests authorization
    app.get('/login', function(req, res) {
        const state = generateRandomString(16);
        res.cookie(STATE_KEY, state);

        const scope = 'user-read-private user-read-email';
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: CLIENT_ID,
                scope: scope,
                redirect_uri: REDIRECT_URI,
                state: state
            }));
    });

    // application requests refresh and access tokens
    // after checking the state parameter
    app.get('/callback', function(req, res) {
        const code = req.query.code || null;
        const state = req.query.state || null;
        const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

        if (state === null || state !== storedState) {
            res.redirect('/#' +
                querystring.stringify({
                    error: 'state_mismatch'
                }));
        } else {
            res.clearCookie(STATE_KEY);
            const authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': `Basic ${new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')}`
                },
                json: true
            };
            request.post(authOptions, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    const access_token = body.access_token, refresh_token = body.refresh_token;
                    const options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: { 'Authorization': `Bearer ${access_token}` },
                        json: true
                    };

                    // use the access token to access the Spotify Web API
                    request.get(options, function(error, response, body) {
                        console.log(body);
                    });

                    // we can also pass the token to the browser to make requests from there
                    res.redirect('/#' +
                        querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token
                        }));
                } else {
                    res.redirect('/#' +
                        querystring.stringify({
                            error: 'invalid_token'
                        }));
                }
            });
        }
    });

    // requesting access token from refresh token
    app.get('/refresh_token', function(req, res) {
        const refresh_token = req.query.refresh_token;
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': `Basic ${new Buffer(client_id + ':' + client_secret).toString('base64')}` },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };
        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token;
                res.send({
                    'access_token': access_token
                });
            }
        });
    });
};
