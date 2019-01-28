var mongoose = require('mongoose');

var fs = require("fs");
// var vm = require("vm");
var requireFromString = require("require-from-string");

var file_ = './node_modules/meanio-users/server/models/user.js';

var str_ = fs.readFileSync(file_);
var str = str_.toString().replace(/mongoose\.model\(\'User\', UserSchema\);/g, ''); //RegExp
var UserSchema = requireFromString(str + 'module.exports =UserSchema;')
 
// console.log(user);
  UserSchema.add({
    data: {
      // oauth: { type: String, required: true },
      oauth: { type: String},
      cart: [{
        product: {
          type: mongoose.Schema.Types.ObjectId
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1
        },
        date: { type: Date
        }
      }],
      viewed: [{
        product: {
          type: mongoose.Schema.Types.ObjectId
        },
        date: { type: Date
        },
        cnt: {
          type: Number,
          default: 1
        }
      }],
      liked: [{
        product: {
          type: mongoose.Schema.Types.ObjectId
        },
        rate: {
          type: Number,
          default: 0
        },
        date: { type: Date
        }
      }],
      scored: [{
        product: {
          type: mongoose.Schema.Types.ObjectId
        },
        rate: {
          type: Number,
          default: 0
        },
        date: { type: Date
        }
      }],
      ordered: [{
        order: {
          type: mongoose.Schema.Types.ObjectId
        }
      }]
    }
    });


  

  UserSchema.set('toObject', { virtuals: true });
  UserSchema.set('toJSON', { virtuals: true });


// console.log(UserSchema);
module.exports = UserSchema;




// module.exports.set('toObject', { virtuals: true });
// module.exports.set('toJSON', { virtuals: true });
