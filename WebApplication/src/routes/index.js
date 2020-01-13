const router = require('express').Router();

router.use('/', require('./home'));
router.use('/login', require('./login'));
router.use('/contact', require('./contact'));
router.use('/connect', require('./connect'));

module.exports = router;