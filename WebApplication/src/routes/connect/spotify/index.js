/* path: /connect/spotify */

const router = require('express').Router();
const querystring = require('querystring');

const env = require('../../../environment');
const { isAuthorized } = require('../../../session');

router.get('/', isAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/connect/spotify`);

    const redirectUri = `${env.WA.URI}/connect/spotify`;
    const requestUri = `${env.SAS.URI}/spotify/login`;

    env.log('GET', requestUri, { redirectUri }, false);

    res.redirect(requestUri + '?' + querystring.stringify({
        redirectUri
    }));
});

// router.get('/confirm', (req, res, next) => {
//     env.log('GET [MIDDLEWARE]', `${env.WA.URI}/connect/spotify/confirm`);
//     console.log(req.session);
//     next();
// }, (req, res) => {
//     env.log('GET', `${env.WA.URI}/connect/spotify/confirm`);
//     res.render('home');
// });

router.post('/', (req, res) => {
    const token = req.body.token;
    env.log('POST', `${env.WA.URI}/connect/spotify`, { token: token.slice(0, 15) + ' [...]' }, true);

    res.sendStatus(200);
});

module.exports = router;