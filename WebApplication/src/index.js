const express = require('express');
const expressSession = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const env = require(`./environment`);
const router = require('./routes');

// console.log(env);

const app = express();

app.set('view engine', 'ejs')
   .set('views', `${__dirname}/views`)
   .set('layout', 'layout');

app.use(express.static(`${__dirname}/public`))
   .use(express.json())
   .use(express.urlencoded({ extended: true }))
   .use(expressLayouts)
   .use(expressSession({
        name: env.WA.SESS.NAME,
        secret: env.WA.SESS.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
   }))
   .use('/', router);

app.listen(env.WA.PORT, () => {
    env.message('Listening on port ', env.WA.PORT);
});