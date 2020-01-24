/* path: /connect/spotify */

const router = require('express').Router();
const querystring = require('querystring');
const request = require('request');

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();

const env = require('../../../environment');
const { isAuthorized, storage } = require('../../../session');

router.get('/', isAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/connect/spotify`);

    if (!req.session.user.spotify) {
        const requestUri = `${env.SAS.URI}/spotify/login`;
        const redirectUri = `${env.WA.URI}/connect/spotify`;

        const data = {
            redirectUri,
            token: req.session.wa.token
        };

        env.log('GET', requestUri, data, false);

        storage.setItem(req.session.wa.token, JSON.stringify({
            wa: req.session.wa,
            user: req.session.user
        }));

        res.redirect(requestUri + '?' + querystring.stringify(data));
    } else {
        res.redirect('/');
    }
});


router.post('/', isAuthorized, (req, res) => {
    const token = req.body.spotify.token;
    const refresh_token = req.body.spotify.refresh_token;

    env.log('POST', `${env.WA.URI}/connect/spotify`, {
        token: token.slice(0, 15) + ' [...]',
        refresh_token: refresh_token.slice(0, 15) + ' [...]'
    }, true);

    req.session.user.spotify = { token, refresh_token };

    spotifyApi.setAccessToken(token);

    spotifyApi.getMe()
        .then((data) => {
            const d = data.body;
            const sess = req.session;

            // storing same data about User from Spotify
            sess.user.spotify.id = d.id;
            sess.user.spotify.href = d.external_urls.spotify;
            sess.user.spotify.name = d.display_name;
            sess.user.spotify.product = d.product;
            if (d.images.length > 0) {
                sess.user.spotify.picture = d.images[0].url;
            }

            // maintaining the current session alive
            storage.setItem(sess.wa.token, JSON.stringify({
                wa: sess.wa,
                user: sess.user
            }));

            res.end();
        }, (err) => {
            console.error(err);
            res.end();
        });
});

router.post('/token', (req, res) => {
    env.log('POST', `${env.WA.URI}/connect/spotify/token`);

    const requestUri = `${env.SAS.URI}/spotify/token`;
    const refresh_token = req.body.refresh_token;

    request.post(requestUri, {
        json: { refresh_token }
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const token = body.access_token;
            if (token) {
                env.log('POST', requestUri, { token: token.slice(0, 15) + ' [...]' }, true);
                res.json({ token });
            }
        } else {
            res.sendStatus(500);
        }
    });
});

module.exports = router;