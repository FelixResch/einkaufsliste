/**
 * Created by Felix Resch on 01-Apr-16.
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', (req, res, next) => {
    if(req.user) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

router.post('/', passport.authenticate('local', {successRedirect: "/", failureRedirect: '/login', session: true}));

module.exports = router;