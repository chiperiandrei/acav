const router = require('express').Router();

router.use('/', require('./home'));
router.use('/login', require('./login'));
router.use('/contact', require('./contact'));
router.use('/connect', require('./connect'));
router.use('/disconnect', require('./disconnect'));
router.use('/register', require('./register'));
router.use('/spotify', require('./spotify'));

module.exports = router;