var express = require('express');
var router = express.Router();
var passport = require('passport');
var loggedin = require('../auth');
var validator = require('validator');
var ObjectId = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', loggedin, function(req, res, next) {
  req.db.collection('lists').find({current: true}).toArray((err, docs) => {
      if(err) {
          throw err;
      }
      if(docs.length == 1) {
          res.render("index", {title: "Downstairs Einkaufsliste", list: docs[0]});
      } else {
          res.render("index", {title: "Downstairs Einkaufsliste"});
      }
  })
});

router.get('/inc/:productId', loggedin, (req, res, next) => {
    var id = validator.isMongoId(req.params.productId) ? new ObjectId(req.params.productId) : req.params.productId;
    req.db.collection('lists').find({current: true}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length == 1) {
            var list = docs[0];
            req.db.collection('products').find({_id: id}).toArray((err, docs) => {
                if(err) {
                    throw err;
                }
                if(docs.length == 1) {
                    req.db.collection('lists').updateOne({_id: list._id, "items._id": id}, {$inc: {"items.$.amount": 1}}, (err, result) => {
                        if(err) {
                            throw err;
                        }
                        if(result.ok = 1) {
                            res.redirect('/')
                        } else {
                            res.status(404);
                            res.render("error")
                        }
                    })
                } else {
                    res.status(404);
                    res.render("error")
                }
            })
        } else {
            res.status(400);
            res.render("error");
        }
    })
});

router.get('/dec/:productId', loggedin, (req, res, next) => {
    var id = validator.isMongoId(req.params.productId) ? new ObjectId(req.params.productId) : req.params.productId;
    req.db.collection('lists').find({current: true}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length == 1) {
            var list = docs[0];
            req.db.collection('products').find({_id: id}).toArray((err, docs) => {
                if(err) {
                    throw err;
                }
                if(docs.length == 1) {
                    req.db.collection('lists').find({_id: list._id, "items._id": id}).toArray((err, docs) => {
                        if(err) {
                            throw err;
                        }
                        if(docs.length == 1) {
                            var list = docs[0];
                            for(var i = 0; i < list.items.length; i++) {
                                if(list.items[i]._id.equals(id)) {
                                    if(list.items[i].amount == 1) {
                                        req.db.collection('lists').updateOne({_id: list._id, "items._id": id}, {$pull: {"items": {_id: id}}}, (err, result) => {
                                            if(err) {
                                                throw err;
                                            }
                                            if(result.ok = 1) {
                                                res.redirect('/')
                                            } else {
                                                res.status(404);
                                                res.render("error")
                                            }
                                        });
                                        return;
                                    } else {
                                        req.db.collection('lists').updateOne({_id: list._id, "items._id": id}, {$inc: {"items.$.amount": -1}}, (err, result) => {
                                            if(err) {
                                                throw err;
                                            }
                                            if(result.ok = 1) {
                                                res.redirect('/')
                                            } else {
                                                res.status(404);
                                                res.render("error")
                                            }
                                        });
                                        return;
                                    }
                                }
                            }
                            res.status(404);
                            res.render("error")
                        } else {
                            res.status(404);
                            res.render("error");
                        }
                    })
                } else {
                    res.status(404);
                    res.render("error")
                }
            })
        } else {
            res.status(400);
            res.render("error");
        }
    })
});

router.get('/remove/:productId', loggedin, (req, res, next) => {
    var id = validator.isMongoId(req.params.productId) ? new ObjectId(req.params.productId) : req.params.productId;
    req.db.collection('lists').find({current: true}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length == 1) {
            var list = docs[0];
            req.db.collection('products').find({_id: id}).toArray((err, docs) => {
                if(err) {
                    throw err;
                }
                if(docs.length == 1) {
                    req.db.collection('lists').updateOne({_id: list._id, "items._id": id}, {$pull: {items: {_id: id}}}, (err, result) => {
                        if(err) {
                            throw err;
                        }
                        if(result.ok = 1) {
                            res.redirect('/')
                        } else {
                            res.status(404);
                            res.render("error")
                        }
                    })
                } else {
                    res.status(404);
                    res.render("error")
                }
            })
        } else {
            res.status(400);
            res.render("error");
        }
    })
});

const productState = (state) => {
    return (req, res, next) => {
        var id = validator.isMongoId(req.params.productId) ? new ObjectId(req.params.productId) : req.params.productId;
        req.db.collection('lists').find({current: true}).toArray((err, docs) => {
            if(err) {
                throw err;
            }
            if(docs.length == 1) {
                var list = docs[0];
                req.db.collection('products').find({_id: id}).toArray((err, docs) => {
                    if(err) {
                        throw err;
                    }
                    if(docs.length == 1) {
                        req.db.collection('lists').updateOne({_id: list._id, "items._id": id}, {$set: {"items.$.state": state}}, (err, result) => {
                            if(err) {
                                throw err;
                            }
                            if(result.result.ok == 1) {
                                res.redirect('/')
                            } else {
                                res.status(500);
                                res.render("error");
                            }
                        })
                    } else {
                        res.redirect('index')
                    }
                })
            } else {
                res.status(500);
                res.render('error');
            }
        })
    }
};

router.get('/tick/:productId', loggedin, productState(true));

router.get('/untick/:productId', loggedin, productState(false));

router.get('/new', loggedin, (req, res, next) => {
    req.db.collection('lists').updateMany({current: true}, {$set: {current: false}}, (err, result) => {
        if(err) {
            throw err;
        }
        req.db.collection('lists').insertOne({
            current: true,
            timestamp: new Date().getTime(),
            items: []
        }, (err, result) => {
            if(err) {
                throw err;
            }
            if(result.result.ok == 1) {
                res.redirect('/');
            } else {
                res.status(500);
                res.render("error")
            }
        })
    })
});

router.use('/add', require('./add'));
router.use('/admin', require('./admin'));

module.exports = router;
