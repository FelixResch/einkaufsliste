var express = require('express');
var router = express.Router();
var passport = require('passport');
var List = require('../types').list;
var validate = require('../objectValidator');

router.get('/', passport.authenticate('basic', {session: false}), (req, res, next) => {

});

router.get('/current', passport.authenticate('basic', {session: false}), (req, res, next) => {

});

router.get('/:listId', passport.authenticate('basic', {session: false}), (req, res, next) => {

});

router.post('/', passport.authenticate('basic', {session: false}), (req, res, next) => {

});

var cb0 = (req, res, next) => {

};

router.post('/current/:productId', passport.authenticate('basic', {session: false}), cb0);
router.put('/current/:productId', passport.authenticate('basic', {session: false}), cb0);
router.patch('/current/:productId', passport.authenticate('basic', {session: false}), cb0);

var cb1 = (req, res, next) => {

};

router.post('/:state/:productId', passport.authenticate('basic', {session: false}), cb1);
router.put('/:state/:productId', passport.authenticate('basic', {session: false}), cb1);
router.patch('/:state/:productId', passport.authenticate('basic', {session: false}), cb1);

var cb2 = (req, res, next) => {

};

router.put('/:listId', passport.authenticate('basic', {session: false}), cb2);
router.patch('/:listId', passport.authenticate('basic', {session: false}), cb2);

router.delete('/:listId/:productId', passport.authenticate('basic', {session: false}), (req, res, next) => {

});

router.delete('/:listId', passport.authenticate('basic', {session: false}), (req, res, next) => {

});

module.exports = router;
