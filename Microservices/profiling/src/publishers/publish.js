var client = require('./elastic/connection.js');
var setup = require('./elastic/create_index.js');

var push_to_ES = function(index, data) {
    setup.create_index(index);
    client.index({
        index: data,
        type: 'user_aggregated_data',
        body: data
    },function(err,resp,status) {
        console.log(resp);
    });
};

exports.push_to_ES = push_to_ES;