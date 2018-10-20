var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/user");
var initProject = require("../src/js/initProject")
var root = 'views';

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  console.log('Restrict root page for logged in users')
  if(req.user){
	res.sendFile('index.html', { user : req.user, 'root': root});
  }
  else{
	res.sendFile('login.html', {'root': root});
  }
};

// Go to registration page
userController.register = function(req, res) {
  res.sendFile('register.html', {'root': root});
};

// Post registration
userController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username}), req.body.password, function(err, user) {
    if (err) {
      return res.sendFile('register.html', { user : user , 'root': root});
    }
	
	//Create a new initial project for the new user
	initProject.initialize(user);

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
};

// Go to login page
userController.login = function(req, res) {
  res.sendFile('login.html', {'root': root});
};

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    res.redirect('/');
  });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;