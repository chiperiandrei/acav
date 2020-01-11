const express = require('express');
const expressSession = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const dotEnv = require('dotenv');

dotEnv.config();

const app = express();

const router = require(`${__dirname}/routes`);

app.set('view engine', 'ejs')
   .set('views', `${__dirname}/views`)
   .set('layout', 'layout');

app.use(express.static(`${__dirname}/public`))
   .use(express.json())
   .use(expressLayouts)
   .use(expressSession({
        name: process.env.SESS_NAME,
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
   }))
   .use('/', router);

const port = process.env.PORT;

app.listen(port);