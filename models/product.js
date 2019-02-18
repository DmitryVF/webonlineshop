var Category = require('./category');
var mongoose = require('mongoose');

module.exports = function(db, fx) {
  var productSchema = {
    name: { type: String, required: true },
    // Pictures must start with "http://"
    pictures: [{ type: String, match: /^http:\/\//i }],
    price: {
      amount: {
        type: Number,
        required: true,
        set: function(v) {
          this.internal.approximatePriceUSD =
            // v * (fx()[this.price.currency] || 1);
            v / (fx()[this.price.currency] || 1);
          return v;
        }
      },
      // Only 3 supported currencies for now
      currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        required: true,
        set: function(v) {
          this.internal.approximatePriceUSD =
            // this.price.amount * (fx()[v] || 1);
            this.price.amount / (fx()[v] || 1);
          return v;
        }
      }
    },
    category: Category.categorySchema,
    internal: {
      approximatePriceUSD: Number
    },
    raiting: {
      ordered:[{      
        quantity: {
          type: Number,
          default: 1,
          min: 1
        },
        date: { 
          type: Date
        }
      }],
      viewed:[{       
        date: { 
          type: Date
        }
      }],
      liked:[{        
        rate: {
          type: Number,
          default: 0
        },
        date: { 
          type: Date
        }
      }],
      score:{       
        rate:{
          type: Number,
          default: 0
        },
        date: { 
          type: Date
        }
      }

    }
  };
mongoose.plugin(schema => { schema.options.usePushEach = true });
  var schema = new mongoose.Schema(productSchema,{usePushEach : true });
  // schema.set(usePushEach, true);
  // var schema = new mongoose.Schema(productSchema, {usePushEach: true});

  //create index on name field
  
  schema.index({ name: 'text' });

  var currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  };

  /*
   * Human-readable string form of price - "$25" rather
   * than "25 USD"
   */
  schema.virtual('displayPrice').get(function() {
    return currencySymbols[this.price.currency] +
      '' + this.price.amount;
  });

  schema.virtual('averscore').get(function() {
    return this.raiting.score.total /
           this.raiting.score.quantity;
  });

  schema.set('toObject', { virtuals: true });
  schema.set('toJSON', { virtuals: true });

  return db.model('Product', schema, 'products');
};
