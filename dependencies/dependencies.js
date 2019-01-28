var fs = require('fs');
var fx = require('./fx');
var Stripe = require('stripe');

//The dependencies.js file exports a function
//that adds a Stripe service to Wagner.

module.exports = function(wagner) {
  var stripekey;
 

  wagner.factory('Stripe', function(Config) {

    if(process.env.NODE_ENV != "production"){
      stripekey = Config.stripeKey;
    }
    else{
      stripekey = process.env.STRIPE_API_KEY;
    };

    return Stripe(stripekey);
  });

  wagner.factory('fx', fx);

  if(process.env.NODE_ENV != "production"){
    wagner.factory('Config', function() {
      return JSON.parse(fs.readFileSync('./config.json').toString());
    });
  }
  
}; 
 