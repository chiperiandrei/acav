const router = require('express').Router();
const request = require('request');
const env = require('../environment');

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

router.get('/login', (req, res) => {
    console.log(`${env.WA.NAME} GET ${env.WA.URI}/login`);

   res.render('login');
});

router.post('/login', (req, res) => {
    console.log(`${env.WA.NAME} POST ${env.WA.URI}/login`);

    const redirectUri = `${env.WA.URI}/login`;
    const requestUri = env.UMS.LOGIN;

    const email = req.body.email;
    const password = req.body.password;
    const token = req.body.token;

    console.log(req.body);

    if (email && password) {
        if (password.length >= 1) {
            request.post(requestUri, {
                json: { email, password }
            }, (error, response, body) => {
                if (error) {
                    console.error(`${env.WA.NAME} [ERROR]`);
                    console.error(error);
                    res.redirect(`${redirectUri}#error`);
                }
                console.log(`${env.WA.NAME} POST ${requestUri}`);
            });
        }
    } else if (token) {
        console.log(token);
    }
    // res.render('login');
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

// router.get('/token', (req, res) => {
//     console.log(spotify);
//     res.render('home');
// });

module.exports = router;