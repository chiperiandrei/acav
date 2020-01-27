/* path: /disconnect/spotify */

const router = require('express').Router();
const request = require('request');

const env = require('../../../environment');
const { isAuthorized } = require('../../../session');

router.get('/', isAuthorized, async  (req, res) => {
    env.log('GET', `${env.WA.URI}/disconnect/spotify`);

    delete req.session.user.spotify;

    const requestUri = `${env.UMS.URI}/update-spotify-token`;

    env.log('PUT', requestUri);

    request.put(requestUri, {
        json: {
            spotify_token: null,
            user_token: req.session.wa.token
        }
    });

    res.redirect('/');
});

module.exports = router;