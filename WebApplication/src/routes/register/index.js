/* path: /register */
const router = require('express').Router();
const request = require('request');

const env = require('../../environment');

router.get('/', (req, res) => {
    env.log('GET', `${env.WA.URI}/register`);
    res.render('register');
});

router.post('/', (req, res) => {
    env.log('POST', `${env.WA.URI}/register`);

    const redirectUri = `${env.WA.URI}/login`;
    const requestUri = `${env.UMS.URI}/register`;

    const email = req.body.email;
    const password = req.body.password;
    const repeatPassword = req.body['repeat-password'];

    if (password === repeatPassword) {
        if (password.length >= 8) {
            request.post(requestUri, {
                json: { email, password }
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    env.log('POST', requestUri, { email, password, repeatPassword }, false);
                    res.redirect(redirectUri)
                }
            });
        }
    }
});

module.exports = router;