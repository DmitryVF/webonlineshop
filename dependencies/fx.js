var superagent = require('superagent');
var _ = require('underscore');


module.exports = function(Config) {

  var openExchangeRatesKey;

  if(process.env.NODE_ENV != "production"){
    openExchangeRatesKey = Config.openExchangeRatesKey;
  }
  else{
    openExchangeRatesKey = process.env.openExchangeRatesKey;
  };

  var url = 'http://openexchangerates.org/api/latest.json?app_id=' +
    Config.openExchangeRatesKey;
  var rates = {
    USD: 1,
    EUR: 0.877,
    GBP: 0.791
  };

  var ping = function(callback) {
    superagent.get(url, function(error, res) {
      // If error happens, ignore it because we'll try again in an hour
      if (error) {
        if (callback) {
          callback(error);
        }
        return;
      }
      // parse the JSON response body:
      var results;
      try {
        var results = JSON.parse(res.text);
        _.each(results.rates || {}, function(value, key) {
          rates[key] = value;
        });
        console.log("rates = "+rates);
        if (callback) {
          callback(null, rates);
        }
      

      } catch (e) {
        if (callback) {
          callback(e);
        }
      }
    });
  };
  // But because JavaScript is single-threaded,
  // no other code can execute while the SuperAgent callback
  // is running.
  // Thus there's no danger of having a half-written rate's
  // object and no need for mutexes.

  setInterval(ping, 60 * 60 * 1000); // Repeat every hour
  
  // Return the current state of the exchange rates
  var ret = function() {
    return rates;
  };
  ping();
  ret.ping = ping; 
  return ret;
};
