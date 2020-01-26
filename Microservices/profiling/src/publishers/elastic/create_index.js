var client = require('./connection.js');

var create_index = function(name) {
    client.indices.create({
        index: name
    },function(err,resp,status) {
        if(err) {
            console.log(err);
        }
        else {
            console.log("create",resp);
        }
    });
};

exports.create_index = create_index;