const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const env = require('./environment');
const router = require('./routes');

// console.log(env);

const app = express();

app.use(cors())
   .use(cookieParser())
   .use(express.json())
   .use(expressSession({
        name: env.SAS.SESS.NAME,
        secret: env.SAS.SESS.SECRET,
        resave : false,
        saveUninitialized : true,
        cookie: { secure: false }
   }))
   .use(env.SAS.REST_PATH, router);

app.listen(env.SAS.PORT, () => {
    env.message('Listening on port ', env.SAS.PORT);
});