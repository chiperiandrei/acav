const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const dotEnv = require('dotenv');

dotEnv.config();

const router = require(`${__dirname}/routes`);

const app = express();

app.set('view engine', 'ejs')
   .set('views', `${__dirname}/views`)
   .set('layout', 'layout');

app.use(express.static(`${__dirname}/public`))
   .use(expressLayouts)
   .use('/', router);

const port = process.env.PORT;

app.listen(port);