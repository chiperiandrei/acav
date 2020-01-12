const dotEnv = require('dotenv');

dotEnv.config();

const env = {
    WA: {
        NAME: `[${process.env.SERVICE_NAME}]`,
        // [WA]

        HOSTNAME: process.env.HOSTNAME,
        // http://localhost

        PORT: process.env.PORT,
        // 8080

        URI: `${process.env.HOSTNAME}:${process.env.PORT}`,
        // http://localhost:8080

        SESS: {
            NAME: process.env.SESS_NAME,
            SECRET: process.env.SESS_SECRET
        }
    },

    UMS: {
        URI: `${process.env.UMS_HOSTNAME}:${process.env.UMS_PORT + process.env.UMS_REST_PATH}`
        // http://localhost:4000/api/ums
    },

    SAS: {
        URI: `${process.env.SAS_HOSTNAME}:${process.env.SAS_PORT + process.env.SAS_REST_PATH}`,
        // http://localhost:3000/api/sas
    }
};

// UMS
env.UMS.LOGIN = env.UMS.URI + process.env.UMS_LOGIN_PATH;

// SAS
env.SAS.SPOTIFY = {
    LOGIN: env.SAS.URI + process.env.SAS_SPOTIFY_LOGIN_PATH
};

module.exports = env;