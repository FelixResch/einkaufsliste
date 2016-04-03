
var express = require('express');
var passport = require('passport');
var marked = require('marked');
var fs = require('fs');
var router = express.Router();

router.get('/', passport.authenticate('basic', {session: false}), (req, res, next) => {
    fs.readFile('rest-service.md', {}, (err, content) => {
        if(err) {
            throw err;
        }
        res.send(marked(content + ''));
    });
});

router.use('/meta', require('./meta'));
router.use('/users', require('./users'));

module.exports = router;