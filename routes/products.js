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

router.post('/', passport.authenticate('basic', {session: false}), (req, res, next) => {
    var product = req.body;
    if(validate.check(product, Product)) {
        if(product._id) {
            req.db.collection('products').find({_id: product._id}).toArray((err, docs) => {
                if(err) {
                    throw err;
                }
                if(docs.length > 0) {
                    res.status(409);
                    res.json({reason: "Object _id already is use!"})
                } else {
                    req.db.collection('products').insertOne(product, (err, result) => {
                        if(err) {
                            throw err;
                        }
                        res.json(result);
                    })
                }
            })
        } else {
            req.db.collection('products').insertOne(product, (err, result) => {
                if(err) {
                    throw err;
                }
                res.json(result);
            })
        }
    } else {
        res.status(400);
        res.json({reason: 'Invalid product!'})
    }
});

var cb0 = (req, res, next) => {
    var product = req.body;
    if(validate.update(product, Product)) {
        req.db.collection('products').find({_id: req.params.productId}).toArray((err, docs) => {
            if(err) {
                throw err;
            }
            if(docs.length == 0) {
                res.status(404);
                res.json({reason: 'Product not found!'})
            } else {
                req.db.collection('products').updateOne({_id: req.params.productId}, product, (err, result) => {
                    if(err) {
                        throw err;
                    }
                    res.json(result);
                });
            }
        });
    } else {
        res.status(400);
        res.json({reason: 'Invalid product!'})
    }
};

router.put('/:productId', passport.authenticate('basic', {session: false}), cb0);
router.patch('/:productId', passport.authenticate('basic', {session: false}), cb0);

router.delete('/:productId', passport.authenticate('basic', {session: false}), (req, res, next) => {
    req.db.collection('products').find({_id: req.params.productId}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length == 0) {
            res.status(404);
            res.json({reason: 'Invalid product!'})
        } else {
            req.db.collection('products').deleteOne({_id: req.params.productId}, (err, result) => {
                if(err) {
                    throw err;
                }
                res.json(result);
            })
        }
    });
});

module.exports = router;