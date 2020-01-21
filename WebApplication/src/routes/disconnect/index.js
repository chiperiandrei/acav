/* path: /connect */

const router = require('express').Router();

const { isAuthorized } = require('../../session');

router.use('/', isAuthorized, async (req, res) => {
    delete req.session.wa;
    delete req.session.user;
    res.redirect('/');
});

router.use('/spotify', require('./spotify'));

module.exports = router;