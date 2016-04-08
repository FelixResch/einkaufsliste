var express = require('express');
var router = express.Router();
var passport = require('passport');
var loggedin = require('../../auth');
var validator = require('validator');
var ObjectId = require('mongodb').ObjectID;

router.use(loggedin);

router.get('/', (req, res, next) => {
    req.db.collection('users').find().toArray((err, docs) => {
        if(err) {
            throw err;
        }
        res.render('admin/users', {title: 'Downstairs Benutzerverwaltung', users: docs});
    })
});

module.exports = router;