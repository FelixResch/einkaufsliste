var express = require('express');
var router = express.Router();
var passport = require('passport');
var loggedin = require('../auth');

/* GET home page. */
router.get('/', loggedin, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
