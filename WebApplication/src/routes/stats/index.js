const router = require('express').Router();

const env = require('../../environment');
const { isAuthorized } = require('../../session');
var request = require('request');
router.get('/', isAuthorized, (req, res) => {
    env.log('GET', `${env.WA.URI}/stats`);

    const sess = req.session;

    const data = {
        currentPage: 'stats'
    };

    const reportingUri = 'http://localhost:5000/api/reporting-service/get-user-music-genres/';
    request(`${reportingUri}+${sess.user.email}`, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body.genres);
        drawPieChart(mapResult(body.genres));
    });
    // request.get(reportingUri + sess.user.email,
    //     (error, response, body) => {
    //         console.log(response)
    //         if (!error && response.statusCode === 200) {
    //
    //             drawPieChart(mapResult(body.genres));
    //         }
    // });

    if (sess.wa && sess.user) {
        data.email = sess.user.email;
    }

    res.render('stats', data);
});

var drawPieChart = function(data) {
    var canvas = document.getElementById('pie');
    var ctx = canvas.getContext('2d');
    var x = canvas.width / 2;
    y = canvas.height / 2;
    var color,
        startAngle,
        endAngle,
        total = getTotal(data);

    for(var i=0; i<data.length; i++) {
        color = getRandomRed();
        startAngle = calculateStart(data, i, total);
        endAngle = calculateEnd(data, i, total);

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(x, y);
        ctx.arc(x, y, y-100, startAngle, endAngle);
        ctx.fill();
        ctx.rect(canvas.width - 200, y - i * 30, 12, 12);
        ctx.fill();
        ctx.font = "13px sans-serif";
        ctx.fillText(data[i].label + " - " + data[i].value + " (" + calculatePercent(data[i].value, total) + "%)", canvas.width - 200 + 20, y - i * 30 + 10);
    }
};

var calculatePercent = function(value, total) {

    return (value / total * 100).toFixed(2);
};

var getTotal = function(data) {
    var sum = 0;
    for(var i=0; i<data.length; i++) {
        sum += data[i].value;
    }

    return sum;
};

var calculateStart = function(data, index, total) {
    if(index === 0) {
        return 0;
    }

    return calculateEnd(data, index-1, total);
};

var calculateEndAngle = function(data, index, total) {
    var angle = data[index].value / total * 360;
    var inc = ( index === 0 ) ? 0 : calculateEndAngle(data, index-1, total);

    return ( angle + inc );
};

var calculateEnd = function(data, index, total) {

    return degreeToRadians(calculateEndAngle(data, index, total));
};

var degreeToRadians = function(angle) {
    return angle * Math.PI / 180
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomRed() {
    var h = 0;
    var s = Math.floor(Math.random() * 100);
    var l = Math.floor(Math.random() * 100);
    var color = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
    return color;
}

function mapResult(map) {
    var mappedResults = [];
    console.log(map)
    for (const [key, val] of Object.entries(map)) {
        mappedResults.push({label: key, value: val});
    }
    return mappedResults;
}

module.exports = router;