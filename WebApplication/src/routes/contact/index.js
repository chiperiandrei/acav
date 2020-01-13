/* path: /contact */

const router = require('express').Router();

const env = require('../../environment');

router.get('/', (req, res) => {
    env.log('GET', `${env.WA.URI}/contact`);
    res.render('contact');
});

module.exports = router;