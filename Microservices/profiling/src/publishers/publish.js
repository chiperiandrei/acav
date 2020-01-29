var client = require('./elastic/connection.js');
var setup = require('./elastic/create_index.js');

var push_to_ES = function(index, data) {
    setup.create_index(index);
    client.index({
        index: index,
        type: 'user_aggregated_data',
        body: JSON.parse(data)
    }, function(err, resp, status) {
        console.log(resp);
    });
};

module.exports.push_to_ES = push_to_ES;