/* path: /disconnect */

const router = require('express').Router();

const env = require('../../environment');
const { isAuthorized } = require('../../session');

router.use('/spotify', require('./spotify'));

router.get('/', isAuthorized, async (req, res) => {
    env.log('GET', `${env.WA.URI}/disconnect`);

    delete req.session.wa;
    delete req.session.user;
    res.redirect('/');
});

module.exports = router;