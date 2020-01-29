var client = require('../elastic/connection.js');

var search = function (index, query) {
    var response={};
    client.search({
        index: index,
        q: `${query}`
    }).then(function (resp) {
        // console.log(resp)
        response = {status: 200, response: JSON.stringify(resp)};
    }, function (err) {
        response = {status: 400, response: err};
    });
    return response;
};

exports.search = search;