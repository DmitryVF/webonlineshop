exports.AddToCartController = function($scope, $http, $user, $timeout) {
  $scope.addToCart = function(product, quant) {
    var quantity= quant? quant : 1;
    // console.log(quantity);
    var obj = { product: product._id, quantity: quantity,name:product.name, displayPrice: product.displayPrice, picture_url: product.pictures };
    $user.user.data.cart.push(obj);
 
    $http.
      put('/api/v1/me/cart', $user.user).
      success(function(data) {
        $user.loadUser();
        $scope.success = true;
  

        $timeout(function() {
          $scope.success = false;
        }, 5000);
      });
  };
};

exports.CategoryProductsController = function($scope, $stateParams, $http,$user, $grade, $css) {

  $css.bind(
    {href: '../stylesheets/shop_styles_custom.css'}
  , $scope);

  // Simply add stylesheet(s)
  $css.add('../stylesheets/shop_styles_custom.css');

  var encoded = encodeURIComponent($stateParams.category);

  $scope.price = undefined;

  /*This enables the user to toggle sorting by price.*/
  $scope.handlePriceClick = function() {
    if ($scope.price === undefined) {
      $scope.price = -1;
    } else {
      $scope.price = 0 - $scope.price;
    }
    $scope.load();
  };
  $http.
    get('/api/v1/category').
    success(function(data) {

      $scope.categories = data.categories;
      //console.log($scope.categories);
    });
  /*It queries the server for which products
    belong to the given category and then adds a special query
    parameter for sorting by price.*/
  $scope.load = function() {
    var queryParams = { price: $scope.price };
    $http.
      get('/api/v1/product/category/' + encoded, { params: queryParams }).
      success(function(data) {
        var prds = data.products.filter(function(prd){
        return (prd.category.ancestors[1] !="Laptops");
        });
        // if(encoded == "Laptops"){
        //   $scope.products = [];
        // }
        // else {$scope.products = data.products;};
        // $scope.products = data.products;

        // grade
         // generates grader obj for each array
        var grade = new $grade();
        grade.init(prds,$user);
        $scope.products= grade.GetProducts();
        $scope.toggle_like = function(prd){grade.toggle_like(prd)};
  
      });
  };
  // $scope.category = encoded;
  $scope.load();


  setTimeout(function() {
    $scope.$emit('CategoryProductsController');
  }, 0);
  /* this event gets triggered
on the next iteration of the event loop
after the template is done rendering.
So this means that your tests can
listen for this event to know when the template is done loading
and it's safe to run tests.*/
};

exports.BlogSingleController = function($scope, $css) {
  $css.bind([
    {href: '../stylesheets/blog_single_styles.css'},
    {href: '../stylesheets/blog_single_responsive.css'},
    {href: '../stylesheets/blog_styles_custom.css'}
  ], $scope);

  // Simply add stylesheet(s)
  $css.add(['../stylesheets/blog_single_styles.css', 
    '../stylesheets/blog_single_responsive.css',
    '../stylesheets/blog_styles_custom.css']);
};
exports.AboutController = function($scope, $css) {
  $css.bind([
    {href: '../stylesheets/blog_single_styles.css'},
    {href: '../stylesheets/blog_single_responsive.css'},
    {href: '../stylesheets/blog_styles_custom.css'}
  ], $scope);

  // Simply add stylesheet(s)
  $css.add(['../stylesheets/blog_single_styles.css', 
    '../stylesheets/blog_single_responsive.css',
    '../stylesheets/blog_styles_custom.css']);
}

exports.CategoryTreeController = function($scope, $stateParams, $http) {
  var encoded = encodeURIComponent($stateParams.category);
  $http.
    get('/api/v1/category/id/' + encoded).
    success(function(data) {
      $scope.category = data.category;
      $http.
        get('/api/v1/category/parent/' + encoded).
        success(function(data) {
          $scope.children = data.categories;
        });
    });

  setTimeout(function() {
    $scope.$emit('CategoryTreeController');
  }, 0);
};

exports.CheckoutController = function($scope, $user, $http, $state, $css) {

  $css.bind([
    {href: '../stylesheets/cart_styles.css'},
    {href: '../stylesheets/cart_responsive.css'},
    {href: '../stylesheets/shop_styles_custom.css'}
  ], $scope);

  // Simply add stylesheet(s)
  $css.add(['../stylesheets/cart_styles.css', 
    '../stylesheets/cart_responsive.css',
    '../stylesheets/shop_styles_custom.css']);

  // For update cart
  $scope.user = $user;
  
  // console.log("$user = "+JSON.stringify($user));
  var updateCart = function() {
    console.log("updating..");
    $http.
      put('/api/v1/me/cart', $user.user).
      then(function(data) {
        $scope.user = data.data;
        // console.log("data = "+JSON.stringify(data));
        // $user.loadUser();
        // $scope.updated = true;
        console.log("updated");
        });
  };
  $scope.$on('user.loaded',function(event) {
    // $scope.user = $user;
    // console.log("$user = "+JSON.stringify($user));
    updateCart();


  });
  updateCart();
  $scope.updateCart = function(){
    updateCart();
    // $window.location.href = '/#/checkout';
    $state.reload();
  };

  //user.user.data.cart

  $scope.getProduct = function(produt_id){
    $http.
      get('/api/v1/product/id/' + produt_id).
      success(function(data) {
        $scope.product = data.product;
      });
    }    

  // For checkout
  Stripe.setPublishableKey('pk_test_4v5vlkU771njziWz6cceNLgC');
  $scope.stripeToken = {
    number: '4242424242424242',
    cvc: '123',
    exp_month: '12',
    exp_year: '2022'
  };

  $scope.checkout = function() {
    $scope.error = null;
    Stripe.card.createToken($scope.stripeToken, function(status, response) {
      if (status.error) {
        $scope.error = status.error;
        return;
      }
      $http.
        post('/api/v1/checkout2', { stripeToken: response.id }).
        success(function(data) {
          $scope.checkedOut = true;
          $user.user.data.cart = [];
          updateCart();
          $state.reload();
        });
    });
  };
}; 

exports.LikesController = function($scope, $user, $http, $state, $q, $grade, $css) {
  // For update cart
  // $scope.user = $user;
  $css.bind([
    {href: '../stylesheets/cart_styles.css'},
    {href: '../stylesheets/cart_responsive.css'},
    {href: '../stylesheets/liked_styles_custom.css'}
  ], $scope);

  // Simply add stylesheet(s)
  $css.add(['../stylesheets/cart_styles.css', 
    '../stylesheets/cart_responsive.css',
    '../stylesheets/liked_styles_custom.css']);


  $user.loadUser();
  $scope.$on('user.loaded',function(event) {
    // console.log("user = "+ JSON.stringify($user.user.data.liked));

    var reqs =[], len = $user.user.data.liked.length;
    // console.log("likes len ="+ len);
  var likes = $user.user.data.liked;
        for (i in likes) {
            reqs.push(
              $http.get('/api/v1/product-to-list/id/' + likes[len-1-i].product)
            );
        };
        $scope.w = []; var prds = [];
        $q.all(reqs).then(function(values){
          for (i in values){
            prds.push(values[i].data.product);

            // console.log("w[i] = "+JSON.stringify(values[i].data));
          }
          var grade = new $grade();
        grade.init(prds,$user);
        $scope.w= grade.GetProducts();
        $scope.toggle_like = function(prd){grade.toggle_like(prd)};

          // console.log("w[] = "+JSON.stringify($scope.w));
        });

        
  });

  $scope.updateLikes = function(){
    $state.reload();
  };

  //user.user.data.cart


}; 

exports.NavBarController = function($scope, $user, $window, Global) {
  $scope.user = $user;
  Global.load();
  // if ($user.data.provider == "facebook"){
  //   $scope.picture_url = 'http://graph.facebook.com/' +
  //             profile.id.toString() + '/picture?type=large';
  // }
  // else $scope.picture_url = '';
  if($user.user){
    $scope.picture_url = $user.user.data;
    // $scope.picture_url2 = $scope.picture_url.profile;

  }

  $scope.$on('user.loaded',function(event) {

    $scope.user = $user;
    $scope.picture_url = $user.user.data;
  }); 

  $scope.signout = function(){
    $window.location.href = '/api/logout';
    //$location.path('/');
  }

  setTimeout(function() {
    $scope.$emit('NavBarController');
  }, 0);
};

exports.ProductDetailsController = function($scope, $stateParams, $http, $user, $grade, $css) {
  var encoded = encodeURIComponent($stateParams.id);

/*takes the product ID from the routeParams service $stateParams,
and makes an HTTP request for the product details.*/

  $css.bind([
    {href: '../stylesheets/product_styles.css'},
    {href: '../stylesheets/product_responsive.css'},
    {href: '../stylesheets/shop_styles_custom.css'}
  ], $scope);

  // Simply add stylesheet(s)
  $css.add(['../stylesheets/product_styles.css', 
    '../stylesheets/product_responsive.css',
    '../stylesheets/shop_styles_custom.css']);


  $http.
    get('/api/v1/product/id/' + encoded).
    success(function(data) {
      console.log("prd: "+ data.product.pictures);
      $scope.image_selected=data.product.pictures[0];
      var pics=new Array('','',''); var i;
      for ( i = 0; i <= 2; i++) {if(data.product.pictures[i]){ pics[i] = data.product.pictures[i]}}  
      // data.product.pictures = pics;
      
      var prod =  data.product; prod.pictures = pics;

      $scope.product = prod;
      $user.loadUser();

      var prds = []; prds.push(data.product);
      var grade = new $grade();
      grade.init(prds,$user);
      // $scope.products= grade.GetProducts();
      $scope.prd = grade.GetProducts()[0];

      $scope.toggle_like = function(prd){grade.toggle_like(prd)};

      $scope.stars = grade.GetStars();
      $scope.hover_stars = function(index,prd){grade.hover_stars(index,prd)};
      $scope.leave_stars = function(index,prd){grade.leave_stars(index,prd)};
      $scope.set_stars =   function(index,prd){grade.set_stars(index,prd)};



    });


  setTimeout(function() {
    $scope.$emit('ProductDetailsController');
  }, 0);
};

exports.SearchBarController = function($scope, $http, $rootScope, $location, $window, $user) {
  // this function should make an HTTP request to
  // `/api/v1/product/text/:searchText` and expose the response's
  // `products` property as `results` to the scope.
  $scope.searchText = ''; 
  $scope.hide_list = 'true';
  $scope.show_list = '';
  $scope.hide_results = function(){
    setTimeout(function(){
      $scope.hide_list = 'true'; 
      $scope.show_list = '';
      $scope.$apply();
    }, 1000);
  };

  $scope.show_results = function(){
     $scope.hide_list = '';
     $scope.show_list = 'true'; 
  }
  $scope.update = function() {
    // if($scope.searchText != ''){
      
      $http.
      get('/api/v1/product/text/' + $scope.searchText).
      success(function(data) {
      $scope.results = data.products;
    });
  // };

  }

  $http.
    get('/api/v1/category').
    success(function(data) {
      $scope.categories = data.categories;
      //console.log($scope.categories);
    });
  
  $scope.toggle_cat_list = '';
  $scope.toggle_cat = function(){
    if (!$scope.toggle_cat_list){
      $scope.toggle_cat_list = 'active';
    }
    else{
      $scope.toggle_cat_list = '';
    }
  }
  $scope.checked_cat='All Categories';
  $scope.check_cat = function(category){
    $scope.toggle_cat_list = '';
    $scope.checked_cat=category._id;
  }

  $scope.search = function(){
    
    if ($scope.checked_cat == 'All Categories'){
      $scope.checked_cat = 'Books'; //for demo purposes only
    }
    $location.path('/category/'+$scope.checked_cat);
  }

  $scope.liked_ct = 0;
  $scope.cart_ct = 0;
  if($user.userLoaded){
    $scope.liked_ct = $user.user.data.liked.length;
    $scope.cart_ct = $user.user.data.cart.length;
  };
  $scope.$on('user.loaded',function(event) {
    $scope.liked_ct = $user.user.data.liked.length;
    $scope.cart_ct = $user.user.data.cart.length;
  });

  $scope.$on('$grade.toggleLike',function(event) {
    $user.loadUser();
  });


  $scope.user = $user;

  setTimeout(function() { 
    $scope.$emit('SearchBarController');
  }, 0);  
}; 

exports.SliderController = function($scope, $http, $rootScope, $location, $window, $timeout) {
  
  $scope.slides2 = [{
    id: 1,
    label: 'slide #' + '1',
    img: 'https://www.apple.com/v/ipad/home/ak/images/overview/ipad_pro_hero__tazkzdo0z8iu_large.jpg' ,
    color: "#fc0003",
    odd: 1
  },
  {
    id: 2,
    label: 'slide #' + '2',
    img: 'https://www.apple.com/v/ipad/home/ak/images/overview/ipad_pro_hero__tazkzdo0z8iu_large.jpg' ,
    // img: 'https://www.apple.com/v/ipad-9.7/j/images/overview/designed_in_mind_large.jpg' ,
    color: "#fc0003",
    odd: 0
  }
  ];
  
  


  setTimeout(function() { 
    $scope.$emit('SliderController');
  }, 0);  
}; 

exports.bestSellersController = function($scope, $http, $rootScope, $location, $window, $timeout, $user, $grade) {
  $scope.index = 0;
  
  $scope.tabs = [
    { status:'active', name:'Top of the Week' },
    { status:'',       name:'Most Liked' },
    { status:'',       name:'Top Scored' }
    
  ];
  $scope.toggle_tab = function(index){
    $scope.index =  index;
    console.log($scope.index);
    for (i in $scope.tabs) {
      if(i == index){
        $scope.tabs[i].status = 'active';
      }
      else {
        $scope.tabs[i].status = '';  
      }
    }
  };



// ToDO : Get raitings from the base
  // get twelve products from the base 
  var queryParams = { price: 0 };
  $http.
      get('/api/v1/product/category/Fiction', { params: queryParams })
      .success(function(data) {
        // console.log("data = "+data.products);
        $scope.products = data.products.slice(0,36);

      })
      .then(function() {
  // ToDo make modifications of product schema to add discount e/t/c

        var top =$scope.products.slice(0,12); 
        var liked =$scope.products.slice(12,24); 
        var scored =$scope.products.slice(24,36);
        
  // generates grader obj for each array
        var tgrade = new $grade();
        tgrade.init(top,$user);
        
        var lgrade = new $grade();
        lgrade.init(liked,$user);

        var sgrade = new $grade();
        sgrade.init(scored,$user);

  //get user-modified prd array for displaying
  // composes objects of top rated, e.t.s divided in to pairs by 6
        $scope.top0= tgrade.GetProducts().slice(0,6);
        $scope.top1= tgrade.GetProducts().slice(6,12);
        $scope.liked0= lgrade.GetProducts().slice(0,6);
        $scope.liked1= lgrade.GetProducts().slice(6,12);
        $scope.scored0= sgrade.GetProducts().slice(0,6);
        $scope.scored1= sgrade.GetProducts().slice(6,12);

  // processing the rating clicks:
        $scope.toggle_like_t = function(prd){tgrade.toggle_like(prd)};
        $scope.toggle_like_l = function(prd){lgrade.toggle_like(prd)};
        $scope.toggle_like_s = function(prd){sgrade.toggle_like(prd)};  

  // processing the stars clicks:

  //gen stars arr and ng-repeat it in view
        $scope.stars = tgrade.GetStars();

  // user events processing:
        $scope.hover_stars_t = function(index,prd){tgrade.hover_stars(index,prd)};
        $scope.hover_stars_l = function(index,prd){lgrade.hover_stars(index,prd)};
        $scope.hover_stars_s = function(index,prd){sgrade.hover_stars(index,prd)};

        $scope.leave_stars_t = function(index,prd){tgrade.leave_stars(index,prd)};
        $scope.leave_stars_l = function(index,prd){lgrade.leave_stars(index,prd)};
        $scope.leave_stars_s = function(index,prd){sgrade.leave_stars(index,prd)};
        
        $scope.set_stars_t =  function(index,prd){tgrade.set_stars(index,prd)};
        $scope.set_stars_l =  function(index,prd){lgrade.set_stars(index,prd)};
        $scope.set_stars_s =  function(index,prd){sgrade.set_stars(index,prd)};
  });

  $scope.slides3 = [{
    id: 1,
    label: 'slide #' + '1',
    img: 'images/banner_2_product.png' ,
    color: "#fc0003",
    odd: 1
  },
  {
    id: 2,
    label: 'slide #' + '2',
    img: 'images/banner_2_product.png' ,
    color: "#fc0003",
    odd: 0
  }];
  $scope.slides31 = $scope.slides3 ;
  $scope.slides32 = $scope.slides3 ;  
  
  setTimeout(function() { 
    $scope.$emit('bestSellersController');
  }, 0);  
}; 
 
// recentlyViewedController
exports.recentlyViewedController = function($scope,$user, $q, $http, $timeout, $sce) {
  // $scope.prevSlide = function(){ return (rnCarousel.prevSlide())};
  // $scope.nextSlide = function(){ return (rnCarousel.nextSlide())};
  // $user.loadUser();
  $scope.v = [];
  
  var loadHistory = function(){
    
    if ($user.user){
      // DeBuG
      // $user.user.data.viewed = [];

      var len = $user.user.data.viewed.length;
      $scope.len = len;
      console.log("len = "+len);
      if(len){
        var reqs = [];
        var viewed = $user.user.data.viewed;
        for (i in viewed) {
            if(i==5){break;};
            reqs.push(
              $http.get('/api/v1/product-to-list/id/' + viewed[len-1-i].product)
            );
          // };
        };
        $scope.v = [];
        $q.all(reqs).then(function(values){
          for (i in values){
            $scope.v.push(values[i].data.product);
            // console.log(values[i].data.product);
          }
        });
      }    
      else{
        //if registered user didn't watch any prds, then:
        loadRecommended();
      };
    };
  };
  var loadRecommended = function(){
  //ToDo: insert recommended into the empty arr of prds
    $scope.v = [];
    var queryParams = { price: 0 };
    $http.
        get('/api/v1/product/category/Fiction', { params: queryParams })
        .success(function(data) {
          // console.log("data = "+data.products);
          $scope.v = data.products.slice(36,42);
          if($user.userLoaded){
            //if user was loaded during async loadRecommended routine then we must reload $scope.v with user history prds:
            if($user.user.data.viewed.length){
              loadHistory();
            };
          }
          console.log('loadRecommended completed')
        });
  };
  
  if($user.userLoaded){
    loadHistory();
    console.log('$user.userLoaded');
  }
  else{
    loadRecommended();
    console.log('loadRecommended');
  };

  $scope.$on('user.loaded',function(event) {
    // $timeout(function() {
      loadHistory();
    // }, 0);
    
    console.log('$on user.loaded');
  });

  $scope.user = $user;
    // angular.forEach($user.user.data.viewed,function(liked){
    //   if(liked.product == prd._id){
    //     if(liked.rate){prd.liked = 'fas'}; //for displaying
    //   };
    // });

  $scope.slides4 = [{
    id: 1,
    label: 'slide #' + '1',
    img: 'images/banner_2_product.png' ,
    color: "#fc0003",
    odd: 1
  },
  {
    id: 2,
    label: 'slide #' + '2',
    img: 'images/banner_2_product.png' ,
    color: "#fc0003",
    odd: 0
  }
  ];
};  
exports.footerBlockController = function($scope, $http) {
$http.
    get('/api/v1/category').
    success(function(data) {
      $scope.categories = data.categories;
      $scope.cats1 = data.categories.slice(0,6);
      $scope.cats2 = data.categories.slice(6,11);
      // console.log("$scope.categories = "+$scope.categories);
    });


};  

exports.MainNavController = function($scope, $http, $rootScope, $location, $window, $compile, $timeout) {
  
  $http.
    get('/api/v1/category').
    success(function(data) {
      $scope.categories = data.categories;
      angular.forEach(data.categories,function (category, key) {
        if(!category.parent){
          mountSubCats(category._id);
          
        }
      });  
    });
    //generates nested menu structure
    function mountSubCats(cat) {
      $http.
      get('/api/v1/category/parent/' + cat).
      success(function(data) {
        angular.forEach(data.categories,function (child, key) {
          //insert shevron for parent element
          if(key==0){
            console.log('key = '+key);
            angular.element(document.getElementById(cat)).parent().find("a")
            .after($compile('<div class= "inline"> <i class="fas fa-chevron-right"></i></div>')($scope));  
          }
          var html= '<li class="hassubs"><div><a class="inline" href="#/category/'+child._id+'">'+child._id+
          '</a></div><ul id="'+child._id+'"></ul></li>';        
          angular.element(document.getElementById(cat)).append($compile(html)($scope));
          $timeout(function() { $scope.$emit('CatMounted',child._id);}, 0); 
        });
      }); 
    }
    $scope.$on('CatMounted',function(event,cat) {
      mountSubCats(cat);
    });
    // https://odetocode.com/blogs/scott/archive/2014/05/07/using-compile-in-angular.aspx

  $scope.burger_toggle = function(id){
    console.log("burger_toggle");
    var menu = angular.element(document.getElementById(id));
    if(menu.hasClass("burger_menu_show")){
      menu.removeClass("burger_menu_show").addClass("burger_menu_hide");
    }
    else if(menu.hasClass("burger_menu_hide")){
      menu.removeClass("burger_menu_hide").addClass("burger_menu_show");
    }
    else{
      menu.addClass("burger_menu_show");
    };
  };

  setTimeout(function() { 
    $scope.$emit('MainNavController');
  }, 0);  
}; 

exports.LoginController = function($scope, $http, $uibModal, $log, $document, $location,$rootScope
// ) {
  ,$state) {
  // , LoginTemplateUrl) {
  var $ctrl = this;

// Attach Custom Data to State Objects 
$ctrl.LoginTemplateUrl = $state.current.stateparams.LoginTemplateUrl;
$ctrl.Card = $state.current.stateparams.card;

  $ctrl.items = 'item1';//['item1', 'item2', 'item3'];

  $ctrl.animationsEnabled = true;
 
  $ctrl.open = function (size, parentSelector) {
    $ctrl.opened = true;
    var parentElem = parentSelector ? 
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'LoginModal.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        items: function () {
          return $ctrl.items;
        },
        LoginTemplateUrl:function () {
          return $ctrl.LoginTemplateUrl;
        },
        Card:function () {
          return $ctrl.Card;
        }
      }
    }); 
 
    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

    if(modalInstance.rendered){
    console.log('modal rendered');
    $scope.$emit('modal.rendered');
    }
  return modalInstance;
  };
}; 

exports.ModalInstanceCtrl = function ($uibModalInstance, items,Card,LoginTemplateUrl,$user, $scope, $rootScope, $location ) {
  $scope.user = $user;
  
  var $ctrl = this;
  $ctrl.modalinstancepresence = true;
  $ctrl.LoginTemplateUrl = LoginTemplateUrl;
  $ctrl.Card = Card;
  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };

  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected.item);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
    $rootScope.loginmodalrendered = false;
     $location.path('');
    
  };

  $scope.$on('modalclosecmd', function(event, data) {
    event.stopPropagation();
    $uibModalInstance.dismiss('cancel');
    console.log('$uibModalInstance.dismiss');
  });

};
exports.RedirectController = function($scope, $window,$timeout ,$user) {
  $user.loadUser();
  $timeout(function() {
          $window.location.href = '/#'; 
        }, 0);
   
};