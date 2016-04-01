
var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', (req, res, next) => {
    if(req.user) {
        req.logout();
        res.redirect('/');
    } else {
        res.status(204);
    }
});

module.exports = router;