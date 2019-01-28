var mongoose = require('mongoose');

var ratingSchema = {
  week: {
    viewed: [{
      product: {
        type: mongoose.Schema.Types.ObjectId
      },
      date: { type: Date
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
      chargeid: {type: String
      }
    }]
  }
};

module.exports = new mongoose.Schema(ratingSchema);
module.exports.ratingSchema = ratingSchema;
