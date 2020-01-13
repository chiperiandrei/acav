const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt'); // TODO: Chiperi (add salt and encrypt, etc.)
const dotEnv = require('dotenv');
// const request = require('request');

dotEnv.config();

// TODO: add logs for /login, /register

const app = express();
const router = express.Router();

const REST_PATH = '/api/ums';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'acav'
});

connection.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.post(REST_PATH + '/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sql = `INSERT INTO users (email, password) VALUES ('${email}', '${password} ')`;
    connection.query(sql, (error, result) => {
        if (error) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.post(REST_PATH + '/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    connection.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password], (error, results, fields) => {
        if (results.length === 1) {
            res.json({
                token: 'test1234' // TODO: Chiperi
            });
        } else {
            res.json({
                message: 'Email or password is incorrect!'
            });
        }
    });
});

app.use('/', router);

const port = process.env.PORT;

app.listen(port);

console.log(`Running at Port ${port}`);