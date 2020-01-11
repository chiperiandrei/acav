const router = require('express').Router();
const spotify = require('./spotify');

router.use('/spotify', spotify);

module.exports = router;