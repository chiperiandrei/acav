/* path: /disconnect/spotify */

const router = require('express').Router();

const env = require('../../../environment');
const { isAuthorized, storage } = require('../../../session');

router.get('/', isAuthorized, (req, res) => {
    delete req.session.user.spotify;
    res.redirect('/');
});

module.exports = router;