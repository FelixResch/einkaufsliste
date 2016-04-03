var express = require('express');
var router = express.Router();
var passport = require('passport');
var obfuscator = require('../obfuscator');
var crypto = require('crypto');
var User = require('../types').user;
var validate = require('../objectValidator');

function hash(password) {
  return crypto.createHash('sha256').update(password).digest('base64');
}

router.get('/', passport.authenticate('basic', {session: false}), function(req, res, next) {
  req.db.collection('users').find().toArray((err, docs) => {
      var config = [];
      if(req.user.role == 'admin') {
          config = [{field: 'password'}]
      } else {
          config = [{field: 'password'}, {field: '_id'}, {field: 'email', type: 'email'}];
      }
      obfuscator(docs, config);
      res.json(docs);
  });
});

router.get('/:userId', passport.authenticate('basic', {session: false}), (req, res, next) => {
    req.db.collection('users').find({_id: req.params.userId}).toArray((err, docs) => {
        var config = [];
        if(req.user.role == 'admin') {
            config = [{field: 'password'}]
        } else {
            config = [{field: 'password'}, {field: '_id'}, {field: 'email', type: 'email'}];
        }
        obfuscator(docs, config);
        res.json(docs[0]);
    });
});

router.post('/', passport.authenticate('basic', {session: false}), (req, res, next) => {
    if(req.user.role != 'admin') {
        res.status(401);
        res.json({reason: 'Unauthorized'});
        return;
    }
    var users = req.db.collection('users');
    users.find({$or: [{username: req.body.username}, {_id: req.body._id}]}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length > 0) {
            res.status(409);
            res.json({reason: 'User already exists!'})
        } else {
            var user = req.body;
            if(!validate.check(user, User)) {
                res.status(400);
                res.json({reason: 'Invalid User'});
                return;
            }
            user.password = hash(user.password);
            users.insertOne(user, (err, doc) => {
                if(err) {
                    throw err;
                }
                obfuscator(doc, [{field: 'password'}]);
                res.json(doc);
            });
        }
    })
});

var cb0 = (req, res, next) => {
    var users = req.db.collection('users');
    users.find({_id: req.params.userId}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length == 1) {
            if(!validate.update(req.body, User)) {
                res.status(400);
                res.json({reason: 'Invalid User'});
                return;
            }
            users.updateOne({_id: req.params.userId}, {$set: req.body}, (err, docs) => {
                if(err)
                    throw err;
                res.json(docs);
            });
        } else {
            res.status(404);
            res.json({"reason":"User not found!"})
        }
    })
};

router.put('/:userId', passport.authenticate('basic', {session: false}), cb0);
router.patch('/:userId', passport.authenticate('basic', {session: false}), cb0);

router.delete('/:userId', passport.authenticate('basic', {session: false}), (req, res, next) => {
    var users = req.db.collection('users');
    users.find({_id: req.params.userId}).toArray((err, docs) => {
        if(err) {
            throw err;
        }
        if(docs.length == 1) {
            users.deleteOne({_id: req.params.userId}, (err, result) => {
                if(err) {
                    throw err;
                }
                res.json(result);
            })
        } else {
            res.status(404);
            res.json({reason: "User not found"})
        }
    });
});

module.exports = router;
