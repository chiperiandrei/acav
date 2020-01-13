const dotEnv = require('dotenv');

dotEnv.config();

const env = {
    SAS: {
        NAME: `[${process.env.SERVICE_NAME}]`,
        // [SAS]

        HOSTNAME: process.env.HOSTNAME,
        // http://localhost

        PORT: process.env.PORT,
        // 3000

        REST_PATH: process.env.REST_PATH,
        // /api/sas

        URI: `${process.env.HOSTNAME}:${process.env.PORT + process.env.REST_PATH}`,
        // http://localhost:3000/api/sas

        SESS: {
            NAME: process.env.SESS_NAME,
            SECRET: process.env.SESS_SECRET
        }
    }
};

env.SAS.SPOTIFY = {
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    STATE_KEY: process.env.SPOTIFY_STATE_KEY,
    LOGIN_PATH: env.SAS.URI + process.env.SPOTIFY_LOGIN_PATH
};

env.log = (method, uri, data, received) => {
    console.log(`${env.SAS.NAME} ${method} ${uri}`);

    if (received === true) {
        process.stdout.write('⤶ ');
    } else if (received === false) {
        process.stdout.write('⤷ ');
    }

    if (data) {
        console.log(data);
    }
};

env.message = (message, data) => {
    process.stdout.write(`${env.SAS.NAME} ${message}`);

    if (data) {
        console.log(data);
    } else {
        console.log();
    }
};

module.exports = env;

