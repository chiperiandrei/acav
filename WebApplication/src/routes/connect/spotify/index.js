/* path: /connect/spotify */

const router = require('express').Router();
const querystring = require('querystring');

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

    env.log('POST', `${env.WA.URI}/connect/spotify`, { token: token.slice(0, 15) + ' [...]' }, true);

    req.session.user.spotify = { token };

    spotifyApi.setAccessToken(token);

    spotifyApi.getMe()
        .then((data) => {
            // console.log(data.body);
            const d = data.body;

            req.session.user.spotify.id = d.id;
            req.session.user.spotify.href = d.external_urls.spotify;
            req.session.user.spotify.name = d.display_name;
            req.session.user.spotify.picture = d.images[0].url;
            req.session.user.spotify.product = d.product;

            storage.setItem(req.session.wa.token, JSON.stringify({
                wa: req.session.wa,
                user: req.session.user
            }));

            res.end();
        }, function(err) {
            console.error(err);
            res.end();
        });
});

// router.get('/token', isAuthorized, (req, res) => {
//     env.log('GET', `${env.WA.URI}/connect/spotify/token`);
// });

module.exports = router;