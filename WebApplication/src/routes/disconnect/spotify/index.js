/* path: /disconnect/spotify */

const router = require('express').Router();

const env = require('../../../environment');
const { isAuthorized } = require('../../../session');

router.get('/', isAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/disconnect/spotify`);

    delete req.session.user.spotify;
    res.redirect('/');
});

module.exports = router;