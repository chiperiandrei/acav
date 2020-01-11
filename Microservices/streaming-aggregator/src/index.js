const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotEnv = require('dotenv');

dotEnv.config();

const app = express();

// TODO: rewrite this
app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser())
    .use(session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized : true,
        resave : true
    }));

const routes = require('./routes');

const port = process.env.PORT;

app.use(process.env.REST_PATH, routes);

app.listen(port);