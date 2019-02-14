var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var _ = require('underscore');

module.exports = function(wagner) {
  var localuri = 'mongodb://localhost:27017/test';
  var uri = process.env.MONGODB_URI || localuri;

  mongoose.connect(uri);

  wagner.factory('db', function() {
    return mongoose;
  });

  var Category =
    mongoose.model('Category', require('./category'), 'categories');
  var User =
    mongoose.model('User', require('./user'), 'users');
  var Order =
    mongoose.model('Order', require('./order'), 'orders');
  var Rating =
    mongoose.model('Rating', require('./rating'), 'ratings');    

  var models = {
    Category: Category,
    User: User,
    Order: Order,
    Rating: Rating
  };
  // To ensure DRY-ness, register factories in a loop
  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });

  wagner.factory('Product', require('./product'));

  return models;
};
