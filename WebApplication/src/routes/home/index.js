/* path: / */

const router = require('express').Router();

const env = require('../../environment');
const { isAuthorized } = require('../../session');

router.get('/', isAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/`);
    res.render('home');
});

router.post('/', isAuthorized, (req, res) => {
    env.log('POST', `${env.WA.URI}/`);

    const token = req.body.token;

    env.message('Spotify token received: ', `${token.slice(0, 20)}...`);

    res.render('home');
});

module.exports = router;