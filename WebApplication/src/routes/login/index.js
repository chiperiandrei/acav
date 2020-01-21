/* path: /login */

const router = require('express').Router();
const request = require('request');

const env = require('../../environment');

router.get('/', async (req, res) => {
    env.log('GET', `${env.WA.URI}/login`);
    res.render('login', { message: '' });
});

router.post('/', async (req, res) => {
    env.log('POST', `${env.WA.URI}/login`);

    const redirectUri = `${env.WA.URI}/`;
    const requestUri = `${env.UMS.URI}/login`;

    const email = req.body.email;
    const password = req.body.password;

    if (email && password) {
        if (password.length >= 8) {
            request.post(requestUri, {
                json: { email, password }
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    env.log('POST', requestUri, { email, password }, false);
                    env.log('POST', requestUri, body, true);

                    if (body && body.token) {
                        req.session.wa = {
                            token: body.token,
                            date: new Date()
                        };
                        req.session.user = {
                            email
                        };
                        res.redirect(redirectUri);
                    } else {
                        res.render('login', { message: body.message });
                    }
                }
            });
        } else {
            res.render('login', { message: 'Incorrect password'});
        }
    }
});

module.exports = router;