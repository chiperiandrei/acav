const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotEnv = require('dotenv');

dotEnv.config();

const router = require(`${__dirname}/routes`);

const app = express();

const port = process.env.PORT;

app.use(express.static(`${__dirname}/public`))
   .use(cors())
   .use(cookieParser())
   .use(express.json())
   .use(session({
        secret: process.env.SESSION_SECRET,
        // cookie: { secure: true },
        resave : false,
        saveUninitialized : true
   }))
   .use(process.env.REST_PATH, router);

app.listen(port);