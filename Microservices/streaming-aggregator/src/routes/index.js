const express = require('express');
const spotifyWrapper = require('./spotify');

const app = express();

spotifyWrapper(app);

module.exports = app;