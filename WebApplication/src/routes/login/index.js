/* path: /login */

const router = require('express').Router();
const request = require('request');

const env = require('../../environment');

router.get('/', async (req, res) => {
    env.log('GET', `${env.WA.URI}/login`);
    res.render('login', { message: '' });
});

router.post('/', async (req, res) => {
    const redirectUri = `${env.WA.URI}/login`;
    const requestUri = `${env.UMS.URI}/login`;

    const email = req.body.email;
    const password = req.body.password;

    env.log('POST', redirectUri);

    if (email && password) {
        if (password.length >= 8) {
            request.post(requestUri, {
                json: { email, password }
            }, (error, response, body) => {
                if (error) {
                    console.log(error);
                }
                env.log('POST', requestUri, { email, password }, false);
                env.log('POST', requestUri, body, true);

                if (body && body.token) {
                    req.session.user = {
                        token: body.token,
                        date: new Date()
                    };
                    res.redirect('/');
                }
                else {
                    res.render('login', { message: body.message });
                }
            });
        }
    }
});

module.exports = router;