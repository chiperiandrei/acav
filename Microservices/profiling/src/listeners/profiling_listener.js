#!/usr/bin/env node

const dotEnv = require('dotenv'); dotEnv.config();
var amqp = require('amqplib/callback_api');
var publisher = require('../publishers/publish.js');

amqp.connect(process.env.RABBITMQ_HOSTNAME, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = process.env.RABBITMQ_AGGREGATIONS_QUEUE;

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            publisher.push_to_ES(process.env.ACAV_INDEX, msg);
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});