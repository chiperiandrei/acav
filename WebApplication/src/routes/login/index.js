/* path: /login */

const router = require('express').Router();
const request = require('request');

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();

const env = require('../../environment');

router.get('/', async (req, res) => {
    env.log('GET', `${env.WA.URI}/login`);
    res.render('login', { message: '' });
});

router.post('/', async (req, res) => {
    env.log('POST', `${env.WA.URI}/login`);

    const redirectUri = `${env.WA.URI}/`;
    const requestUri = `${env.UMS.URI}/login`;
    const tokenUri = `${env.WA.URI}/connect/spotify/token`;

    const sess = req.session;
    const email = req.body.email;
    const password = req.body.password;

    if (email && password) {
        if (password.length >= 8) {
            request.post(requestUri, {
                json: { email, password }
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    env.log('POST', requestUri, { email, password }, false);
                    env.log('POST', requestUri, body, true);

                    if (body && body.token) {
                        sess.wa = {
                            token: body.token,
                            date: new Date()
                        };
                        sess.user = {
                            email
                        };

                        if (body.spotify_token) {
                            sess.user.spotify = {refresh_token: body.spotify_token};

                            request.post(tokenUri, {
                                json: { refresh_token: sess.user.spotify.refresh_token }
                            }, (error, response, body) => {
                                if (!error && response.statusCode === 200) {
                                    sess.user.spotify.token = body.token;
                                    spotifyApi.setAccessToken(sess.user.spotify.token);
                                    spotifyApi.getMe()
                                        .then((data) => {
                                            const d = data.body;
                                            sess.user.spotify.id = d.id;
                                            sess.user.spotify.href = d.external_urls.spotify;
                                            sess.user.spotify.name = d.display_name;
                                            sess.user.spotify.product = d.product;
                                            if (d.images.length > 0) {
                                                sess.user.spotify.picture = d.images[0].url;
                                            }
                                            res.redirect(redirectUri);
                                        }, (err) => {
                                            console.error(err);
                                            delete sess.user.spotify;
                                            res.redirect(redirectUri);
                                        });
                                } else {
                                    delete sess.user.spotify;
                                    res.redirect(redirectUri);
                                }
                            });
                        } else {
                            res.redirect(redirectUri);
                        }
                    } else {
                        res.render('login', { message: body.message });
                    }
                }
            });
        } else {
            res.render('login', { message: 'Incorrect password'});
        }
    }
});

module.exports = router;