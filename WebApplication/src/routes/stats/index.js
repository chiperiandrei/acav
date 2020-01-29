const router = require('express').Router();

const env = require('../../environment');
const { isAuthorized } = require('../../session');

router.get('/', isAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/stats`);

    const sess = req.session;

    const data = {
        currentPage: 'stats'
    };

    if (sess.wa && sess.user) {
        data.email = sess.user.email;
    }

    res.render('stats', data);
});

module.exports = router;