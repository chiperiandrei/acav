/* path: / */

const router = require('express').Router();

const env = require('../../environment');
const { isAuthorized } = require('../../session');

router.get('/', isAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/`);

    const sess = req.session;

    const data = {
        email: sess.user.email
    };

    if (sess.user.spotify) {
        data.spotify = {
            href: sess.user.spotify.href,
            name: sess.user.spotify.name,
            picture: sess.user.spotify.picture
        };
    }

    res.render('home', data);
});

router.post('/', isAuthorized, (req, res) => {
    env.log('POST', `${env.WA.URI}/`);

    const token = req.body.token;

    env.message('Spotify token received: ', `${token.slice(0, 20)}...`);

    res.render('home');
});

module.exports = router;