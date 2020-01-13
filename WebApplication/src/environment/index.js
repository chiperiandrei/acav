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

env.log = (method, uri, data, received) => {
    console.log(`${env.WA.NAME} ${method} ${uri}`);

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
    process.stdout.write(`${env.WA.NAME} ${message}`);

    if (data) {
        console.log(data);
    } else {
        console.log();
    }
};

module.exports = env;