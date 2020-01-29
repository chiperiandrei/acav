const express = require('express');
const app = express();
const router = express.Router();
const REST_PATH = '/api/reporting-service';
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const elasticsearch = require('elasticsearch');
const reports = require('./src/reports/reports.js');

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace',
    apiVersion: '7.2', // use the same version of your Elasticsearch instance
});
router.get(REST_PATH + '/get-count-by-genre/:genre', (req, res) => {
    const genres = req.params.genre;
    var query = `"tracks.genres" = "${genres}"`;

    client.search({
        index: process.env.ACAV_INDEX,
        q: query
    }).then(function (resp) {
        res.status(200).send({
            "count": resp.hits.total.value,
            "genre": genres
        })
    }, function (err) {
        res.status(400).send({
            "error": err
        })
    });

});
router.get(REST_PATH + '/get-user-music-genres/:email', (req, res) => {
    const email = req.params.email;
    var query = `"email" = "${email}"`;
    client.search({
        index: process.env.ACAV_INDEX,
        q: query
    }).then(function (resp) {
        var genres = [];
        var i;
        for( i =0;i<resp.hits.hits[0]._source.tracks.length;i++){
            genres.push(... resp.hits.hits[0]._source.tracks[i].genres)
        }
        res.status(200).send({
            "genres": genres,
            "email" : email
        })
    }, function (err) {
        res.status(400).send({
            "error": err
        })
    });

});


dotEnv.config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);

const port = process.env.port || 5000;

app.listen(port);


console.log(`Running at Port ${port}`);
