var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', passport.authenticate('basic', {session: false}), (req, res, next) => {
    if (req.db) {
       req.db.collection('meta').find().toArray((err, docs) => {
           if(err) {
               console.error(err);
           } else {
               res.json(docs);
           }
       });
    } else {
        res.json([]);
    }
});

module.exports = router;