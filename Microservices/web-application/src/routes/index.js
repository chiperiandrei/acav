const router = require('express').Router();
const request = require('request');

const WA = `[${process.env.SERVICE_NAME}]`,
      // [WA]
      REDIRECT_URI = `${process.env.HOSTNAME}:${process.env.PORT}`,
      // http://localhost:8080
      REQUEST_URI = `${process.env.SAS_HOSTNAME}:${process.env.SAS_PORT + process.env.SAS_REST_PATH}`;
      // http://localhost:3000/api/sas

router.get('/', (req, res) => {
    console.log(`${WA} GET ${REDIRECT_URI}/`);

    res.render('home');
});

router.post('/', (req, res) => {
    console.log(`${WA} POST ${REDIRECT_URI}/`);
    console.log(`${WA} Spotify token received`); // req.body.token
    // console.log(req.body.token);

    res.render('home');
});

router.get('/login', (req, res) => {
    console.log(`${WA} GET ${REDIRECT_URI}/login`);

   res.render('login');
});

router.get('/login/spotify', (req, res) => {
    console.log(`${WA} GET ${REDIRECT_URI}/login/spotify`);

    const redirectUri = REDIRECT_URI;
    // http://localhost:8080

    const requestUri = `${REQUEST_URI}/spotify/login`;
    // http://localhost:3000/api/sas/spotify/login

    request.post(requestUri, {
        json: { redirect: redirectUri }
    }, (error, response, _) => {
        if (error) {
            console.error(`${WA} [ERROR]`);
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