#!/usr/bin/env node

const dotEnv = require('dotenv'); dotEnv.config();
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client( {
    hosts: [
        process.env.ELASTICSEARCH_HOSTNAME
    ],
    apiVersion: process.env.ELASTICSEARCH_VERSION
});

module.exports = client;