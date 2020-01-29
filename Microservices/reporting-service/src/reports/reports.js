var client = require('./elastic/connection.js');

var search = function(index, query) {
    client.search({
        index: index,
        q: query
    }).then(function(resp) {
        return { status: 200, response: resp };
    }, function(err) {
        return { status: 400, response: err };
    });
};

exports.search = search;