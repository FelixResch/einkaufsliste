
var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if(req.user) {
        req.logout();
        res.redirect('/');
    } else {
        res.status(204);
    }
});

module.exports = router;