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

/* Get register page. */
router.get('/', function(req, res, next) {
  if(req.cookies.logged){
  	res.redirect('/member');
  } else {
  	res.render('./register', { title: 'Register' });
  }
});

/* Proccess Register*/
console.log ("call POST")
router.post('/', function(req, res, next) {
  console.log ("IN POST")
  var user = new User({
  	name: req.body.name,
  	card: req.body.card,
  	password: req.body.password,
  	email: req.body.email
  });

  user.save();
  res.render('./login', { title: 'Login' });
  logger.info(user.email + " has just created a new account");
});
module.exports = router;
