var bodyparser = require('body-parser'); 
var express = require('express'); 
var status = require('http-status'); 
var _ = require('underscore'); 
var moment = require('moment');
 
module.exports = function(wagner) { 
  var api = express.Router(); 
 
  api.use(bodyparser.json()); 

    /* Category API */
  api.get('/category/id/:id', wagner.invoke(function(Category) {
    return function(req, res) {
      Category.findOne({ _id: req.params.id }, function(error, category) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        if (!category) {
          return res.
            status(status.NOT_FOUND).
            json({ error: 'Not found' });
        }
        res.json({ category: category });
      });
    };
  }));

  api.get('/category/parent/:id', wagner.invoke(function(Category) {
    return function(req, res) {
      Category.
        find({ parent: req.params.id }).
        sort({ _id: 1 }).
        exec(function(error, categories) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          res.json({ categories: categories });
        });
    };
  }));
  
  api.get('/category', wagner.invoke(function(Category) {
    return function(req, res) {
      Category.
        find({}).
        sort({ _id: 1 }).
        exec(function(error, categories) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          res.json({ categories: categories });
        });
    };
  }));
  
  /* Product API */
  api.get('/product/id/:id', wagner.invoke(function(Product, User) {
    return async (req, res)=>{
      try { 
        var now = new Date();
        var prd = await Product.findOneAndUpdate ({ _id: req.params.id },
          { "$push": { 
            "raiting.viewed": { date: now } 
            }
          }).exec();
        if (req.isAuthenticated()){
          const user = await User.findOne ({ _id: req.user._id }).exec();
          if (user){

            // user.data.viewed = []; //temporary to clean user log
            // user.save();
            var exist = false;
            var temp = {};
            for (i in user.data.viewed) {
              //if prd was recently viewed by the user:
              if(user.data.viewed[i].product == req.params.id){
                var exist = true;
                temp = user.data.viewed[i];
                user.data.viewed.splice(i, 1);
                // console.log(user.data.viewed[i]);
                break;
              };
            }   //if doesn't exist (wasn't recently viewed by the user):
            if(exist==false){
              user.data.viewed.push({ product:req.params.id, date:now, cnt :Number.parseInt(1) });
            }
            else {
              user.data.viewed.push({ product:req.params.id, date:now, cnt :Number.parseInt(temp.cnt+1) });
            };
            
            await user.save();
          };
        };  
        // console.log("prd :" +prd);
        res.json({product: prd});
      } catch(error){
        return res.
                status(status.INTERNAL_SERVER_ERROR).
                json({ error: error.toString() });
      }
    };
  }));

  api.get('/product-to-list/id/:id', wagner.invoke(function(Product) {
    return async (req, res)=>{
      try { 
        var prd = await Product.findOne({ _id: req.params.id }).exec();//.select("-raiting").exec();
        // console.log(prd);
        res.json({ product: prd});
      }  
      catch(error){
        return res.
        status(status.INTERNAL_SERVER_ERROR).
        json({ error: error.toString() });
      }  
    }
  }));

  api.get('/product/category/:id', wagner.invoke(function(Product) {
    return function(req, res) {
      var sort = { name: 1 };
      /*URL has this form : \category\id?price=1 
      it used in CategoryProductsController*/
      if (req.query.price === "1") {
        sort = { 'internal.approximatePriceUSD': 1 };
      } else if (req.query.price === "-1") {
        sort = { 'internal.approximatePriceUSD': -1 };
      }

      Product.
        find({ 'category.ancestors': req.params.id }).
        sort(sort).
        exec(handleMany.bind(null, 'products', res));
    };
  }));
 
  // https://stackoverflow.com/questions/15128849/using-multiple-parameters-in-url-in-express
  api.get('/product/grade11', wagner.invoke(function(Product, User) {
    return function(req, res) {
      // req.query.type;
      // req.query.id;
      // req.query.rate;
      // console.log(req.query);
      res.json({ query: req.query });
    }
  }));    
  api.get('/product/grade', wagner.invoke(function(Product, User) {
    return async (req, res)=>{
      try { 
      //api parameters : req.query.type; // req.query.id; // req.query.rate; 
        var now = new Date();
        // console.log("query");
        if(req.query.type == 'liked'){
          var prd = await Product.findOneAndUpdate ({ _id: req.query.id },
            { "$push": { 
                "raiting.liked": { rate: Number.parseInt(req.query.rate), date: now } 
              }
            },{new: true}
          ).exec();
        }
        else if(req.query.type == 'score'){
          var prd = await Product.findOneAndUpdate ({ _id: req.query.id },
            { "$push": { 
                "raiting.score": { rate: Number.parseInt(req.query.rate), date: now } 
              }
            },{new:true}
          ).exec(); 
        };
        // console.log("prd= "+prd);
      // updating the "liked" or "score" log in the user object:
        if (req.isAuthenticated()){
          var product = req.query.id;
          var rate = req.query.rate;
          const user = await User.findOne ({ _id: req.user._id }).exec();
          if (user){
            var grade_arr = (req.query.type == "liked") ?
              user.data.liked:
              user.data.scored;
            if(grade_arr.length){
              var i,j,n=0; //calc num of rate elements needed to remove
              for(i = 0; i < grade_arr.length; i++){
                if (grade_arr[i].product == product) {n++}; 
              };
              for(j = 0; j < n; j++){
                for(i = 0; i < grade_arr.length; i++){
                  if (grade_arr[i].product == product) {
                    grade_arr.splice(i, 1); 
                    break;
                  }; //delete the old rate
                };
              };  
            }; 
            // console.log(grade_arr);  
            // grade_arr.push({product:product, rate:Number.parseInt(rate), date:now});
            if(req.query.type == "liked"){
              if(Number.parseInt(req.query.rate)==1){
                grade_arr.push({product:product, rate:Number.parseInt(rate), date:now});
                user.data.liked = grade_arr;
              }
              else{
                user.data.liked = grade_arr;
                // DeBuG:
                // user.data.liked = [];
              };  
            }
            else{
              grade_arr.push({product:product, rate:Number.parseInt(rate), date:now});
              user.data.scored = grade_arr;
            };
            await user.save();
          };
        }
        res.json(prd);
      } catch(error){
        return res.
                status(status.INTERNAL_SERVER_ERROR).
                json({ error: error.toString() });
      }
    };
  }));
  
  /* User API */
    //it saves data put by user in the user/cart 
  api.put('/me/cart', wagner.invoke(function(User, fx) {
    
    return async (req, res)=>{
      try { 
        var cart = req.body.data.cart; 
      } catch(e) {                     
        return res. 
          status(status.BAD_REQUEST).
          json({ error: 'No cart specified!' });
      }
      
      req.user.data.cart = cart;  
      await req.user.save();
      // console.log("card saved to user doc");
      await req.user.populate({ path: 'data.cart.product', model: 'Product' , select: '-raiting' }).execPopulate();
      // console.log("Checkpoint3");
      await req.user.populate({ path: 'data.ordered.order', model: 'Order' , select: '-agent'}).execPopulate();
      // console.log("Checkpoint4");

        var DisplayTotalCost = 0; 
        var currencySymbols = {
          'USD': '$',
          'EUR': '€',
          'GBP': '£'
        };

          var user = JSON.parse(JSON.stringify(req.user));
          _.each(user.data.cart, function(item,i) {
            // console.log("item = "+item);
            user.data.cart[i].product.displayPrice = currencySymbols[item.product.price.currency] +
          '' + item.product.price.amount;
            user.data.cart[i].product.totalPrice = currencySymbols[item.product.price.currency] +
          '' + item.product.price.amount*item.quantity;
            
            DisplayTotalCost += item.product.price.amount/fx()[item.product.price.currency]  *item.quantity;
          }); 
          user.data.DisplayTotalCost = "$" + Math.ceil(DisplayTotalCost);  

        console.log("user.data.cart[0] = " + JSON.stringify(user.data.cart[0]));
        res.json({ user: user });
        // console.log("Checkpoint5");
    };
  })); 

  api.get('/me', function(req, res) {
    if (!req.user) {
      return res.
        status(status.UNAUTHORIZED).
        json({ error: 'Not logged in' });
    }

    res.json({ user: req.user });
   });
 
  api.post('/checkout2', wagner.invoke(function(User, Stripe, Order, Product, fx) { 
   return async (req, res)=>{
    try {
      if (!req.user) {
        return res.
          status(status.UNAUTHORIZED).
          json({ error: 'Not logged in' });
      }
      // console.log("checkout2");

      // Populate the products in the user's cart

      await req.user.populate({ path: 'data.cart.product', model: 'Product' }).execPopulate();
      var totalCostUSD = 0;
      
      _.each(req.user.data.cart, function(item) {
        totalCostUSD += item.product.price.amount/fx()[item.product.price.currency] *item.quantity;
      }); 
        totalCostUSD = Math.ceil(totalCostUSD);
      console.log("checkout2 #1");
      // And create a charge in Stripe corresponding to the price
      const charge = await Stripe.charges.create({
          // Stripe wants the price in cents, so multiply by 100 and round up
          amount: Math.ceil(totalCostUSD * 100),
          currency: 'usd',
          source: req.body.stripeToken, //The credit card is represented by this req.body
                  //it is something that represents a credit card. It can be ENCODED JSON object that contains the credit card
                  //information, including the number and the expiration date
                  //Because of some significant regulatory hurdles in the US,
                  //Stripe provides the ability to compute a secure token
                  //in the browser that lets your server charge the user's credit
                  //card without actually knowing what the credit card number is. 
          description: 'Example charge'
      });
    // if there are no errors

    // 1) save the cart to the orders database with charge.id, user ID and date, with status fields
      var now = new Date();
      const user_ = await User.findOne({ _id: req.user._id }).exec();  
      var  usercart = user_.data.cart;
      var order = new Order({
           'user' : req.user._id,
           'chargeid': charge.id,
           'cart': usercart, 
           'totalCostUSD': totalCostUSD,
           'chargedate': now, 
           'status': 'paid',
           'statusdate': now, 
           'agent' : 'user'});
      const orser_save_res = await order.save();
            // console.log("order save");
            
//ToDo: 2) send charge.id with cart to user by email. charge.id gives the ability to user to monitor order status             

     // 3) store charge.id in user orders field

     // req.user.data.ordered = [];
      req.user.data.ordered.push({order:res._id});
      // console.log('userorders = '+ req.user.data.ordered);
      console.log("checkout2 #4");
     // 4) for each item in cart we must refresh fields:
          // - product.raiting.ordered.quantity
          // - product.raiting.ordered.date

          //run in concurrently way : if sequence needed then use modern for - of loop
          //https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop

      await Promise.all(req.user.data.cart.map(async (item) => {
        const c_prd = await Product.findOneAndUpdate ({ _id: item.product },
          {
            "$push": { 
                "raiting.ordered": { quantity: item.quantity, date: now } }
          }).exec();
        // console.log(c_prd);
      }));
      console.log("checkout2 #5");
      // empty out the user's carts:
      req.user.data.cart = [];
      // and save the user.
      await req.user.save(); //save returns a promise & so .exec() is not needed
        // Ignore any errors - if we failed to empty the user's
        // cart, that's not necessarily a failure
        // If successful, return the charge id from stripe operation to client
      res.json({ id: charge.id });
      // console.log("checkout2 #6"); 

    } catch (err) {
      if (err && err.type === 'StripeCardError') {
        return res.
          status(status.BAD_REQUEST).
          json({ error: err.toString() });
      }
      if (err) {
        console.log(err);
        return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({ error: err.toString() });
      }
      // return res.json(err);
      //  How to control flow in mixed sync-async environment:
      // https://www.reddit.com/r/javascript/comments/8ljamc/nodejs_sqlite3_how_to_control_flow_in_mixed/
    }
   }
   
  })); 
  
  //product text search 
  api.get('/product/text/:query', wagner.invoke(function(Product) {
    return function(req, res) {
      Product.
        find(
          //find relevant phrases in the index 
          { $text : { $search : req.params.query } },
          { score : { $meta: 'textScore' } }).
         // sort by most relevant documents first.
        sort({ score: { $meta : 'textScore' } }).
        limit(10).
        exec(handleMany.bind(null, 'products', res));
    };
  }));
  api.get('/global', function(req, res) {
    console.log("process.env.NODE_ENV = "+JSON.stringify(process.env.NODE_ENV));
    res.json({ NODE_ENV: process.env.NODE_ENV}); 
   });
  
  return api;
};

function handleOne(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }
  if (!result) {
    return res.
      status(status.NOT_FOUND).
      json({ error: 'Not found' });
  }
  
  // console.log("handle one: "+result);
  // console.log("handle one: "+result.raiting.liked);
  var json = {};
  json[property] = result;
  res.json(json);
}

function handleMany(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}
