var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
var winston = require('winston');
var logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    //new winston.transports.Console()
    new (winston.transports.File)(
      {
          filename: "requests.log",
      }
  )
  ]
});

/* Get login page. */
router.get('/', function(req, res, next) {
  if(req.cookies.logged){
  	res.redirect('/member');
  } else {
  	res.render('login', { title: 'Login' });
  }
});

/* Proccess Login */
router.post('/', function(req, res, next) {
  var email = req.body.email;
  var pass = req.body.password;
  var query = User.findOne({ 'email': email, 'password':pass });
  query.select('id email password');
  query.exec(function (err, user) {
  if (err) return handleError(err);
  if (user){
  	console.log('Email: %s, Password: %s', user.email, user.password);
    logger.info(user.email + " has logged in successfully");
    logger.info('200 HTTP response');
  	res.cookie('logged',user.id);
  	res.redirect('./member');
    } else {
      res.status(500);
  	  res.render('index', { title: '    Invalid Credentials' });    
      console.log({
        level: 'warning",
        message: 'User has entered invalid credentials'),
        status: '500'
      });
      //logger.log('The user has entered invalid login credentials');
      //logger.info('500 HTTP error');

  }
  });
});
module.exports = router;
