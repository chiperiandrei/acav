const router = require('express').Router();
const request = require('request');
// const querystring = require('querystring');
const env = require('../environment');

router.get('/login', async (req, res) => {
    env.log('GET', `${env.WA.URI}/login`);
    res.render('login', { message: '' });
});

router.post('/login', async (req, res) => {
    const redirectUri = `${env.WA.URI}/login`;
    const requestUri = env.UMS.LOGIN;

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
                    res.redirect('/');
                }
                else {
                    res.render('login', { message: body.message });
                }
            });
        }
    }
});

router.get('/login/spotify', (req, res) => {
    console.log(`${env.WA.NAME} GET ${env.WA.URI}/login/spotify`);

    const redirectUri = env.WA.URI;
    const requestUri = env.SAS.SPOTIFY.LOGIN;

    request.post(requestUri, {
        json: { redirect: redirectUri }
    }, (error, response, _) => {
        if (error) {
            console.error(`${env.WA} [ERROR]`);
            console.error(error);
            res.redirect(`${redirectUri}#error`);
        }
        res.redirect(response.request.uri.href);
    });
});

router.get('/', (req, res) => {
    console.log(`${env.WA.NAME} GET ${env.WA.URI}/`);

    res.render('home');
});

router.post('/', (req, res) => {
    console.log(`${env.WA.NAME} POST ${env.WA.URI}/`);

    const token = req.body.token;

    console.log(`${env.WA.NAME} Spotify token received: ${token.slice(0, 20) + '...'}`);
    // console.log(token);

    res.render('home');
});

// router.get('/token', (req, res) => {
//     console.log(spotify);
//     res.render('home');
// });

module.exports = router;