var express = require('express');
var router = express.Router();
var auth = require('../util/auth');
var UserModel = require('../models/User');

router.use(auth.require_login);

router.get('/', function(req, res, next) {
  res.render('discover', { title: 'Minder Discover' });
});

router.get('/get-all-users', function(req, res, next){
  UserModel.find({
    email: {'$ne': req.user.email},
  }, function(err, users){
    res.send(users);
  });
});

router.get('/get-all-tags-users', function(req, res, next){
  UserModel.find(
    { tags: {$in: req.user.tags},
    email: {'$ne': req.user.email}, }
    , function(err, users){
    res.send(users);
  });
} );

router.get('/get-all-local-users', function(req, res, next){
  UserModel.find({
    email: {'$ne': req.user.email},
    city: req.user.city
  }, function(err, users){
    res.send(users);
  });
});

router.get('/profile/:id', function(req, res, next){
  UserModel.findOne( { _id: req.param('id') }, function(err, user){
    res.render("discover_profile", {user: user});
  });
});

router.get('/:mode', function(req, res, next){
    res.render("discover_results", {mode: req.param('mode')} );
});

module.exports = router;
