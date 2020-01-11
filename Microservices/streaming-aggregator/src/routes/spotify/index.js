const request = require('request');
const crypto = require('crypto');
const querystring = require('querystring');

const SAS = `[${process.env.SERVICE_NAME}]`;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const STATE_KEY = process.env.SPOTIFY_STATE_KEY;
const REDIRECT_URI = `http://localhost:${process.env.PORT + process.env.REST_PATH}/callback`;

module.exports = (app) => {
    // application requests authorization
    app.get('/login', function(req, res) {
        const state = crypto.randomBytes(64).toString('hex');
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
            const buffer = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET);
            const authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': `Basic ${buffer.toString('base64')}`
                },
                json: true
            };
            request.post(authOptions, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    const refresh_token = body.refresh_token;

                    console.log(`${SAS} Login finished:`);
                    console.log(`access_token: ${body.access_token}`);
                    console.log(`refresh_token: ${refresh_token}`);
                    return res.status(200).json({ token: refresh_token });
                } else {
                    console.error(`${SAS} Login failed:`);
                    return res.status(403).json({ message: 'invalid token' });
                }
            });
        }
    });

    // requesting access token from refresh token
    app.get('/token', function(req, res) {
        const refresh_token = req.body.refresh_token;
        console.log(refresh_token);
        return res.status(200).json({ token: 'todo' });

        // const buffer = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET);
        // const authOptions = {
        //     url: 'https://accounts.spotify.com/api/token',
        //     headers: { 'Authorization': `Basic ${buffer.toString('base64')}` },
        //     form: {
        //         grant_type: 'refresh_token',
        //         refresh_token: refresh_token
        //     },
        //     json: true
        // };
        // request.post(authOptions, function(error, response, body) {
        //     if (!error && response.statusCode === 200) {
        //         const access_token = body.access_token;
        //         res.send({
        //             'access_token': access_token
        //         });
        //     }
        // });
    });

    // getting playlists
    // app.get('/get_playlist', function(req, res) {
    //     console.log()
    // });
};

