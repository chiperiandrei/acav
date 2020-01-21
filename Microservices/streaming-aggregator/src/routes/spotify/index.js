/* path: /spotify */

const router = require('express').Router();
const request = require('request');
const crypto = require('crypto');
const querystring = require('querystring');

const env = require('../../environment');

// application requests authorization
router.get('/login', (req, res) => {
    env.log('GET', `${env.SAS.URI}/spotify/login`);

    const state = crypto.randomBytes(64).toString('hex');
    res.cookie(env.SAS.SPOTIFY.STATE_KEY, state);

    // redirect to ACAV WA
    if (req.query) {
        req.session.redirectUri = req.query.redirectUri;
        req.session.token = req.query.token;
    }

    // redirect from Spotify API
    const redirectUri = `${env.SAS.URI}/spotify/callback`;

    const scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id: env.SAS.SPOTIFY.CLIENT_ID,
        scope: scope,
        redirect_uri: redirectUri,
        state: state
    }));
});

// application requests refresh and access tokens
// after checking the state parameter
router.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[env.SAS.SPOTIFY.STATE_KEY] : null;
    const redirectUri = `${env.SAS.URI}/spotify/callback`;
    const responseUri = req.session.redirectUri;
    const wa = { token: req.session.token };

    if (state === null || state !== storedState) {
        res.redirect(responseUri + '/#' + querystring.stringify({
            error: 'state_mismatch'
        }));
    } else {
        res.clearCookie(env.SAS.SPOTIFY.STATE_KEY);
        const buffer = Buffer.from(env.SAS.SPOTIFY.CLIENT_ID + ':' + env.SAS.SPOTIFY.CLIENT_SECRET);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': `Basic ${buffer.toString('base64')}`
            },
            json: true
        };
        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const refresh_token = body.refresh_token;
                const access_token = body.access_token;

                env.log(
                    'GET',
                    `${env.SAS.URI}/spotify/callback`,
                    {
                        access_token: access_token.slice(0, 15) + ' [...]',
                        refresh_token: refresh_token.slice(0, 15) + ' [...]'
                    },
                    true
                );

                request.post(responseUri, {
                    json: {
                        spotify: {
                            token: access_token,
                        },
                        wa
                    }
                }, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        env.log('POST', responseUri, { token: refresh_token.slice(0, 15) + ' [...]' }, false);
                        res.redirect(responseUri + '/?' + querystring.stringify({
                            wa: wa.token
                        }));
                    }
                });
                // res.status(200).json({ token: refresh_token });
            } else {
                env.message('Login failed!');

                return res.status(403).json({ message: 'invalid token' });
            }
        });
    }
});

// requesting access token from refresh token
router.get('/token', (req, res) => {
    const refresh_token = req.body.refresh_token;
    console.log(refresh_token);

    // return res.status(200).json({ token: 'todo' });
    //
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

module.exports = router;
