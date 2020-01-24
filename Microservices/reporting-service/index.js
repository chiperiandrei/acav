const express = require('express');
const app = express();
const router = express.Router();
const REST_PATH = '/api/reporting-service';
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace',
    apiVersion: '7.2', // use the same version of your Elasticsearch instance
});
router.get(REST_PATH + '/get-count-by-genre/:genre', (req, res) => {
    const genres = req.params.genre;
    console.log(genres);
    client.search({
        index: 'acav',
        type: 'genre',
        q: `user@email.com:${genres}`
    }).then(function(resp) {
        res.status(200).send({
            "count": resp.hits.total.value
        })
    }, function(err) {
        //console.trace(err.message);
    });


});



dotEnv.config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);

const port = process.env.port || 5000;

app.listen(port);



console.log(`Running at Port ${port}`);
