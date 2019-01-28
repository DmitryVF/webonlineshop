var mongoose = require('mongoose');

var orderSchema = {
  // _id: { type: String },
  user: {type: String,   ref: 'User'},    
  chargeid: { type: String },
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
  totalCostUSD: {type: Number
  },
  chargedate: { type: Date
  },
  status: { type: String
  },
  statusdate: { type: Date
  },
  agent : { type: String
  }
};

module.exports = new mongoose.Schema(orderSchema);
module.exports.orderSchema = orderSchema;
