var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('config');
var crypto = require('crypto');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var async = require('async');

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var rest = require('./routes/rest');

var mongodb;
var mongocfg = config.get('db.credentials');
if(mongocfg.provider == 'openshift-env') {
  var mongourl = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
      process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
      process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
      process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
      process.env.OPENSHIFT_APP_NAME;
} else if (mongocfg.provider == 'url') {
  var mongourl = mongocfg.url;
}

MongoClient.connect(mongourl, (err, db) => {
  assert.equal(err, null, "Error detected while connecting to MongoDB instance");
  console.log("Connected correctly to server");
  mongodb = db;
  db.collection('meta').find().toArray((err, docs) => {
      if(err) {
        console.error("Error while fetching db meta", err);
      } else {
        if (docs.length == 0) {
            console.log("No meta");
            async.series([
                (callback) => {
                    db.collection('users').insert({username: "root", password: hash("1a2b3c4d5e"), role: 'admin', email: "felix.resch@femo.io"}, (err, docs) => {
                        assert.equal(err, null, "Error while inserting user");
                        callback();
                    });
                },
                (callback) => {
                    db.collection('users').insert({username: "test", password: hash("12345"), role: 'user', email: "test.test@testmail.com"}, (err, docs) => {
                        assert.equal(err, null, "Error while inserting user");
                        callback();
                    });
                },
                (callback) => {
                    assert.equal(err, null, "Error while inserting user");
                    db.collection('meta').insert({type : "setup", timestamp: new Date()});
                    initPassport();
                    callback();
                }])
        } else {
            initPassport()
        }
      }
  });
});

function hash(password) {
    return crypto.createHash('sha256').update(password).digest('base64');
}

function initPassport() {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    var callback = (username, password, done) => {
        var pwd = hash(password);
        mongodb.collection('users').find({username: username, password: pwd}).toArray((err, docs) => {
            if(err) {
                done(err);
            } else if (docs.length == 1) {
                done(null, docs[0]);
            } else {
                done(null, false, {message: "Invalid User"})
            }
        });
    };
    passport.use(new BasicStrategy(callback));
    passport.use(new LocalStrategy(callback));
    initRouter();
}

function initRouter() {
    app.use(session({
        secret: 'einkaufsliste',
        store: new MongoStore({db: mongodb}),
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
        if(mongodb)
            req.db = mongodb;
        next();
    });

    app.use('/', routes);
    app.use('/rest', rest);
    app.use('/login', login);
    app.use('/logout', logout);

// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if(process.env.NODE_ENV == 'production') {
    app.use((req, res, next) => {
        if(req.headers["x-forwarded-proto"] == 'http') {
            res.redirect('https://' + req.headers.host + req.path);
        } else {
            next();
        }
    });
}
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static( path.join(__dirname, '/bower_components')));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});


module.exports = app;
