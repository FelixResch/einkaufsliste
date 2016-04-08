var express = require('express');
var router = express.Router();
var passport = require('passport');
var loggedin = require('../auth');
var validator = require('validator');
var ObjectId = require('mongodb').ObjectID;
var winston = require('winston');

router.get('/', loggedin, (req, res, next) => {
    req.db.collection('products').find().toArray((err, docs) => {
        if(err) {
            throw err;
        }
        res.render("add", {title: "Element hinzufügen", products: docs});
    });
});

router.post('/', loggedin, (req, res, next) => {
    winston.info("Incoming |POST /add| request", req.body);
    if(!validator.isInt(req.body.amount)) {
        res.status(400);
        res.render("app");
        return;
    }
    var productId = validator.isMongoId(req.body.product) ? new ObjectId(req.body.product) : req.body.product;
    req.db.collection('products').find({_id: productId}).toArray((err, docs) => {
        if(err) {
            winston.warn('Could not find product with productId %s', productId.toString(), err);
            throw err;
        }
        if(docs.length == 1) {
            var product = docs[0];
            req.db.collection('lists').find({current: true}).toArray((err, docs) => {
                if(err) {
                    winston.warn('Could not find current list', err);
                    throw err;
                }
                if(docs.length == 1) {
                    var list = docs[0];
                    var insert = () => {
                        req.db.collection('lists').updateOne({_id: list._id}, {$push: {items: {
                            display: product.display,
                            timestamp: new Date().getTime(),
                            _id: product._id,
                            amount: Number(req.body.amount)
                        }}}, (err, result) => {
                            if(err) {
                                throw err;
                            }
                            if(result.result.ok == 1) {
                                res.redirect('/')
                            } else {
                                res.status(500);
                                res.render("error");
                            }
                        });
                    };
                    if(list.items.length > 0) {
                        for(var i = 0; i < list.items.length; i++) {
                            if(list.items[i]._id.equals(productId)) {
                                req.db.collection('lists').updateOne({_id: list._id, "items._id": productId}, {$inc: {"items.$.amount": Number(req.body.amount)}}, (err, result) => {
                                    if(err) {
                                        throw err;
                                    }
                                    if(result.result.ok == 1) {
                                        res.redirect('/');
                                    } else {
                                        res.status(500);
                                        res.render("error");
                                    }
                                });
                                return;
                            }
                        }
                        insert();
                    } else {
                        insert();
                    }
                } else {
                    res.status(500);
                    res.render("error");
                }
            })
        } else {
            winston.warn('Product %s not found!', productId.toString());
            res.status(404);
            res.render("app");
        }
    })
});

module.exports = router;