const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotEnv = require('dotenv');

dotEnv.config();

const app = express();

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

const routes = require('./routes');

const port = process.env.PORT;

app.use(process.env.REST_PATH, routes);

app.listen(port);