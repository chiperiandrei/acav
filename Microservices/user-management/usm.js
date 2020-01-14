const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql')
const app = express();
const path = require('path');
const router = express.Router();
const apipath = '/api/ums';
const request = require('request');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'acav'
})
connection.connect();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));

});

router.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname + '/register.html'));
});

router.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});
router.post(apipath + '/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    var sql = `INSERT INTO users (email, password) VALUES ('${email}', '${password} ')`;
    connection.query(sql, function (err, result) {
        if (err) {
            res.send("Greseala");
        }
        res.send("Te-ai inregistrat!!");
    });
});

router.post(apipath + '/login', (req, res) => {
    // console.log(req.query);
    // console.log(req.body);

    const email = req.body.email;
    const password = req.body.password;

    connection.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password], (error, results, fields) => {
        if (results.length === 1) {
            res.json({
                // status: 200,
                token: 'test1234'
            });
        } else {
            res.json({
                // status: 403,
                message: 'Email or password is incorrect!'
            });
        }
    });
});

app.use('/', router);

const port = process.env.port || 4000;

app.listen(port);

console.log(`Running at Port ${port}`);