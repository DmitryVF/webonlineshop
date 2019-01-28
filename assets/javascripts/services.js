var status = require('http-status');

exports.$user1 = function($http) {
  var s = {};
  s.loadUser = function() {
    $http.
      get('/api/v1/me').
      success(function(data) {
        s.user = data.user;
        $rootScope.$broadcast('user.loaded');
        // console.log("user.loaded");
      }).
      error(function(data, status) {
        if (status === status.UNAUTHORIZED) {
          s.user = null;
          $rootScope.$broadcast('user.loaded');
        }
      });
  };

  s.loadUser();/*this was done only for ability to call setInterval() */

  setInterval(s.loadUser, 60 * 60 * 1000);

  return s;
}; 
exports.$user = function($http,$rootScope) {
  // var s = {};
  function userClass(){
    this.user = null;
    this.userLoaded = null;
  };

  userClass.prototype.loadUser = function() {
      var self = this;
      $http.
        get('/api/v1/me').
        success(function(data) {
          self.user = data.user;
          $rootScope.$broadcast('user.loaded');
          self.userLoaded = true;
        }).
        error(function(data, status) {
          if (status === status.UNAUTHORIZED) {
            self.user = null;
            $rootScope.$broadcast('user.loaded');
            self.userLoaded = true;
          }
        });
  };
  
  var s = new userClass();
  s.loadUser();/*this was done only for ability to call setInterval() */

  setInterval(s.loadUser, 60 * 60 * 1000);

  return s;
}; 

//used in meanio-users in meanUser service
exports.$meanConfig = function() {
  var config = {};
  config.loginPage = '/login';

  return config;
}; 

//used in meanio-users in meanUser service
exports.Global = function() {
  var Global = {};

  Global.authenticate = function() {
  };

  return Global;
}; 

exports.$grade = function($http,$rootScope) {
  // class that includes common logic executed by clicking on "like" and "star-score" buttons
  function GradeClass(){
    this.products = [];
    this.$user = {};
    //gen stars arr and ng-repeat it in view
    this.stars_arr = [];
    for(i = 1; i < 6; i++){
      this.stars_arr.push(i);
    };
    this.updateRatings = function(prd,$user) {
    // this.updateRatings = function(prd,$user) {
      // for each prd checks likes data from $user and adds it to prd object for rendering
      prd.liked = 'far'; 
      if ($user.user){
        angular.forEach($user.user.data.liked,function(liked){
          if(liked.product == prd._id){
            if(liked.rate){prd.liked = 'fas'}; //for displaying
          };
        });
      };
      return prd;
    };
  
    this.updateStars = function(prd,$user){
      // for each prd from collection calc-s star raiting
          var sum = 0;
          var n = 0;
        angular.forEach(prd.raiting.score,function(scorei){
          sum += scorei.rate;
          n += 1;
        });
        
        prd.averStars = (n>0) ? Math.round(sum/n) : 0;
        prd.averrating = "rating_r_"+ prd.averStars; //buffered for displaying
        prd.userrating = "rating_r_"+ prd.averStars; //for displaying
        // console.log("sum =" +sum+"; n ="+n + " aver =" + sum/n + "round ="+prd.averStars+ "displ ="+prd.userrating);
      // adds raiting data to each prd from collection and returns it for rendering
      return prd;
    };
  }

  GradeClass.prototype.GetStars = function(){
    return this.stars_arr;
  }; 
  GradeClass.prototype.GetProducts = function(){
    return this.products;
  }; 
  GradeClass.prototype.init = function(products,$user) {
    this.$user = $user;
    this.products = products;
    var self = this;
    angular.forEach(products,function(prd,key){
      // calc-s raitings & adds it to prd obj-s for rendering
      self.products[key] = self.updateRatings(prd,self.$user);
      self.products[key] = self.updateStars(prd,self.$user);
    });
  }
  
  
  // processing the rating clicks:
  GradeClass.prototype.toggle_like = function(prd){
    //handle click on like 
    if (prd.liked == 'far'){
      prd.liked = 'fas'; //for view changing
      prd.likedscore = '1'; //for logging into the database
    }
    else{
      prd.liked = 'far';
      prd.likedscore = '0';
    };
    var self = this;
    // update products that must refresh the view
    angular.forEach(self.products,function(prdx,key){
      if(prdx._id == prd._id){self.products[key] = prd;};
    });

    // sinc with the server in back process...
    var queryParams = { type: 'liked', id:prd._id, rate:prd.likedscore};
    $http.
      get('/api/v1/product/grade', { params: queryParams })
      .success(function(data) {
        // emit an event to inform all vidgets to refresh their like's counters (if they have them)
        $rootScope.$broadcast("$grade.toggleLike");
      });
  };

   // processing the stars clicks:
  // user events processing:
  GradeClass.prototype.hover_stars = function(index,prd){
    prd.userrating = "rating_r_"+index;
  };

  GradeClass.prototype.leave_stars = function(index,prd){
    //  restore raiting using product array because it could be changed during hover (if user clicked)

    var self = this;
    console.log("self.products = "+self.products);
    angular.forEach(self.products,function(prdx,key){
          if(prdx._id == prd._id){
            prdx.userrating = prdx.averrating;
            prd.userrating = prdx.userrating;
          };
        });
  };

  GradeClass.prototype.set_stars = function(index,prd){
    // update products rate:
    var self = this;
    // sinc with the server in back process...
    var queryParams = { type: 'score', id:prd._id, rate:index};
    $http.
      get('/api/v1/product/grade', { params: queryParams })
      .success(function(product) {
        // update products that must refresh the view
        prd.userrating = self.updateStars(product,self.$user).userrating;
        angular.forEach(self.products,function(prdx,key){
          if(prdx._id == prd._id){
            self.products[key] = product;
          };
        });
    });
  
  };

  return GradeClass;
};