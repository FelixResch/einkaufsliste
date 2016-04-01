
var express = require('express');
var router = express.Router();

router.use('/meta', require('./meta'));
router.use('/users', require('./users'));

module.exports = router;