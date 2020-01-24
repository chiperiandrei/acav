const express = require('express');
const mysql = require('mysql');
const app = express();
const router = express.Router();
const REST_PATH = '/api/ums';
var bodyParser = require('body-parser');

const dotEnv = require('dotenv');
dotEnv.config();
var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERDB,
    password: process.env.PASSWORDDB,
    database: process.env.DATABASE
});

var md5 = require('md5');
const tokenGenerator = function (email, password) {
    var token = '';
    for (var i = 0; i < email.length; i++) {
        token += email.charAt(i);
        token += password.charAt(i);
    }
    return token;
};

connection.connect();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
router.post(REST_PATH + '/register', (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);
    const token = tokenGenerator(email, password);
    var sql = `INSERT INTO users (usertoken, email, password) VALUES ('${token}','${email}', '${password}')`;
    connection.query(sql, function (err, result) {
        if (err) {
            res.status(404).send({
                "error": "Something went wrong!"
            });

        }
        res.status(200).send({
            "success": "You have been registered!"
        });
    });
});

router.post(REST_PATH + '/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email], (error, results, fields) => {
            if (results.length === 1) {
                if (md5(password) === results[0].password) {
                    res.json({
                        token: results[0].usertoken
                    });
                } else {
                    res.json({
                        "message": "Incorrect password"
                    });
                }

            } else {
                res.status(404).json({
                    message: 'Email or password is incorrect!'
                });
            }
        });
});
router.put(REST_PATH + '/update-spotify-token', (req, res) => {
    const spotifyToken = req.body.spotifytoken;
    const usertoken = req.body.usertoken;
    let sql = 'UPDATE users set spotifyToken=? WHERE usertoken=?';

    let data = [spotifyToken, usertoken];
    connection.query(sql, data, (error, results, fields) => {
        if (results.affectedRows === 0) {
            res.status(404).send({
                "message": "Token incorrect!"
            })
        } else {
            res.status(200).send({
                "message": "Token updated!"
            })
        }
    });

});
router.post(REST_PATH + '/insert-genres', (req, res) => {
    const usertoken = req.body.usertoken;
    const genres = req.body.genres;
    console.log(usertoken);


    connection.query(
        'SELECT * FROM users WHERE userToken = ?',
        [usertoken], (error, results, fields) => {
            if (results.length === 1) {
                let sql_genres = `INSERT INTO genres (user_email, genre) VALUES('${results[0].email}','rissssss')`;
                connection.query(sql_genres, (error, result, fields) => {
                    if (error !== null) {
                        try {
                            res.status(404).send({
                                "message": "Oups~~"
                            })
                        } catch (error) {

                        }

                    } else {
                        res.status(200).send({
                            "message": "Inserted"
                        })
                    }
                });

            } else {
                res.status(404).json({
                    message: 'token invalid'
                });
            }
        });
});
app.use('/', router);

const port = process.env.port || 4000;

app.listen(port);

console.log(`Running at Port ${port}`);
