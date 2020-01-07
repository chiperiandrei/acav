const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql')
const app = express();
const path = require('path');
const router = express.Router();
const apipath = '/api/usm';
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
    const email = req.body.email;
    const password = req.body.password;

    connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function (error, results, fields) {
        if (results.length == 1) {
            res.send("Logat!!")
        } else {
            res.send('email/ pass incorect');
        }
        res.end();
    });
});
app.use('/', router);
app.listen(process.env.port || 4000);

console.log('Running at Port 3000');