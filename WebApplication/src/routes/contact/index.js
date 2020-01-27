/* path: /contact */

const router = require('express').Router();

const env = require('../../environment');

router.get('/', (req, res) => {
    env.log('GET', `${env.WA.URI}/contact`);

    const sess = req.session;

    const data = {
        currentPage: 'contact'
    };

    if (sess.wa && sess.user) {
        data.email = sess.user.email;
    }

    res.render('contact', data);
});

module.exports = router;