var express = require('express');
var router = express.Router();
var passport = require('passport');
var loggedin = require('../auth');
var validator = require('validator');
var ObjectId = require('mongodb').ObjectID;

router.use(loggedin);

router.get('/', (req, res, next) => {
    res.render('admin', {title: "Downstairs Einstellungen"});
});

router.use('/users', require('./admin/users'));

module.exports = router;