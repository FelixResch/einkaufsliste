var express = require('express');
var router = express.Router();
var passport = require('passport');
var Product = require('../types').product;
var validate = require('../objectValidator');

router.get('/', passport.authenticate('basic', {session: false}), (req, res, next) => {
    req.db.collection('products').find().toArray((err, docs) => {
        if(err) {
            throw err;
        }
        res.json(docs);
    });
});

router.get('/byIsbn/:isbn', passport.authenticate('basic', {session: false}), (req, res, next) => {
    req.db.collection('products').find({isbn: req.params.isbn}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length == 1) {
            res.json(docs[0]);
        } else {
            res.json(docs);
        }
    })
});

router.get('/:productId', passport.authenticate('basic', {session: false}), (req, res, next) => {
    req.db.collection('products').find({_id: req.params.productId}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length == 1) {
            res.json(docs[0]);
        } else {
            res.json(docs);
        }
    })
});

module.exports = router;