var express = require('express');
var router = express.Router();
var passport = require('passport');
var List = require('../types').list;
var validate = require('../objectValidator');

function fixInvalidState(db) {
    db.collection('lists').find({current: true}).sort({timestamp: -1}).skip(1).toArray((err, docs) => {
        docs.forEach((doc) => {
            db.collection('lists').findOneAndUpdate({_id: doc._id}, {$set: {current: false}});
        })
    })
}

router.get('/', passport.authenticate('basic', {session: false}), (req, res, next) => {
    req.db.collection('lists').find().toArray((err, docs) => {
        if(err) {
            throw err;
        }
        res.json(docs);
    })
});

router.get('/current', passport.authenticate('basic', {session: false}), (req, res, next) => {
    req.db.collection('lists').find({current: true}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length != 1) {
            res.status(500);
            res.json({reason: 'Invalid data state'});
            fixInvalidState(req.db)
        } else {
            res.json(docs[0]);
        }
    });
});

router.get('/:listId', passport.authenticate('basic', {session: false}), (req, res, next) => {
    req.db.collection('lists').find({_id: req.params.listId}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        res.json(docs[0]);
    });
});

router.post('/new', passport.authenticate('basic', {session: false}), (req, res, next) => {
    var lists = db.req.collection('lists');
    lists.findOneAndUpdate({current: true}, {$set: {current: false}}, (err, res) => {
        if(err) {
            throw err;
        }
        var list = {
            current: true,
            timestamp: new Date().getTime(),
            items: []
        };
        if(validate.check(list, List)) {
           lists.insertOne(list, (err, result) => {
               if(err) {
                   throw err;
               }
               res.json(result);
           });
        } else {
            res.status(500);
            res.json('Invalid state in program!');
        }
    })
});

router.post('/', passport.authenticate('basic', {session: false}), (req, res, next) => {
    var list = req.body;
    if(validate.check(list, List)) {
        req.db.collection('lists').insertOne(list, (err, result) => {
            if(err) {
                throw err;
            }
            res.json(result);
        });
    } else {
        res.status(400);
        res.json({reason: 'Invalid List!'})
    }
});

var cb0 = (req, res, next) => {
    var db = req.db;
    db.collection('products').find({_id: req.params.productId}).toArray((err, prods) => {
        if(err) {
            throw err;
        }
        if(prods.length != 1) {
            res.status(400);
            res.json({reason: 'Did not find one product with id!'})
        } else {
            var prod = prods[0];
            db.collection('lists').find({current: true}).toArray((err, docs) => {
                if(err) {
                    throw err;
                }
                if(docs.length != 1) {
                    res.status(500);
                    res.json({reason: 'Invalid data state'});
                    fixInvalidState(req.db);
                } else {
                    var list = docs[0];
                    var found = false;
                    for(var i = 0; i < list.items.length; i++) {
                        if(list.items[i]._id == prod._id) {
                            found = true;
                            break;
                        }
                    }
                    if(found) {
                        db.collection('lists').updateOne({_id: list._id, "items._id": prod._id},
                            {$inc: {"items.$.amount" :  req.body.amount || 1}}, (err, result) => {
                                if(err) {
                                    throw err;
                                }
                                res.json(result);
                        })
                    } else {
                        db.collection('lists').updateOne({_id: list._id}, {$push: {items: {
                            _id: prod._id,
                            added: new Date().timestamp,
                            display: prod.display,
                            amount: req.body.amount || 1
                        }}}, (err, result) => {
                            if(err) {
                                throw err;
                            }
                            res.json(result);
                        })
                    }

                }
            });
        }
    });
};

router.put('/current/:productId', passport.authenticate('basic', {session: false}), cb0);
router.patch('/current/:productId', passport.authenticate('basic', {session: false}), cb0);

var cb1 = (req, res, next) => {
    req.db.collection('lists').find({current: true, "items._id": req.params.productId}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length != 1) {
            res.status(404);
            res.json({reason: 'No matching item found in current list!'})
        } else {
            req.db.collection('lists').updateOne({current: true, "items._id" : req.params.productId}, {"items.$.state": req.params.state == 'tick'}, (err, result) => {
                if(err) {
                    throw err;
                }
                res.json(result);
            })
        }
    });
};

router.put('/:state/:productId', passport.authenticate('basic', {session: false}), cb1);
router.patch('/:state/:productId', passport.authenticate('basic', {session: false}), cb1);

var cb2 = (req, res, next) => {
    var list = req.body;
    if(validate.update(list, List)) {
        req.db.collection('lists').find({_id: req.params.listId}).toArray((err, docs) => {
            if(err) {
                throw err;
            }
            if(docs.length != 1) {
                res.status(404);
                res.json({reason: 'No matching lists found!'})
            } else {
                req.db.collection('lists').updateOne({_id: req.params.listId}, req.body, (err, result) => {
                    if(err) {
                        throw err;
                    }
                    res.json(result);
                });
            }
        })
    } else {
        res.status(400);
        res.json({reason: 'Invalid List!'})
    }
};

router.put('/:listId', passport.authenticate('basic', {session: false}), cb2);
router.patch('/:listId', passport.authenticate('basic', {session: false}), cb2);

router.delete('/:listId/:productId', passport.authenticate('basic', {session: false}), (req, res, next) => {
    req.db.collection('lists').find({_id: req.params.listId, "items._id": req.params.productId}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length != 1) {
            res.status(404);
            res.json({reason: 'No matching lists found!'})
        } else {
            req.db.collection('lists').updateOne({_id: req.params.listId}, {$pull: {items: {_id: req.params.productId}}}, (err, result) => {
                if(err) {
                    throw err;
                }
                res.json(result);
            });
        }
    })
});

router.delete('/:listId', passport.authenticate('basic', {session: false}), (req, res, next) => {
    req.db.collection('lists').find({_id: req.params.listId, "items._id": req.params.productId}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length != 1) {
            res.status(404);
            res.json({reason: 'No matching lists found!'})
        } else {
            req.db.collection('lists').deleteOne({_id: req.params.listId}, (err, result) => {
                if(err) {
                    throw err;
                }
                res.json(result);
            });
        }
    })
});

module.exports = router;
