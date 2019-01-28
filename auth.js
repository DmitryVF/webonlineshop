//This function that it exports is responsible for taking
//an express app and attaching login to it.
 

function setupAuth(User, app, Config) {

  var config = require('config');
 
// if(config.strategies.local.enabled)
//   {
//     console.log("local_enabled");
//   }

  var passport = require('passport');

  // init strategies
  require('./node_modules/meanio-users/passport.js')(passport);


  // Set up Express middlewares
  app.use(require('express-session')({
    secret: 'this is a_ secret'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
 
  var auth, database;
 

var MeanUser = {};
MeanUser.events = {};
MeanUser.events.publish = function(){};
app.use(function(req, res, next) {
req.cookies = {};
req.cookies.redirect = ''; 
console.log(req.cookies);
next();
});

var requireFromString = require("require-from-string");
var fs = require("fs");
var file_ = './node_modules/meanio-users/server/routes/users.js';
var str_ = fs.readFileSync(file_);
var str__ = str_.toString().replace(/, \'user_about_me\'/g, ''); //RegExp
var str = str__.replace(/..\/controllers\/users/g, 
  '.\/node_modules\/meanio-users\/server\/controllers\/users'); //RegExp

requireFromString(str)(MeanUser, app, auth, database, passport);
  
  //for MeanUser service compatibilities
  app.get('/api/circles/mine', function(req, res){res.json({})});


}  






module.exports = setupAuth;
