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

module.exports.create_index = create_index;