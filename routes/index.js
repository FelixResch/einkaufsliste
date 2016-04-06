var express = require('express');
var router = express.Router();
var passport = require('passport');
var loggedin = require('../auth');

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

module.exports = router;
