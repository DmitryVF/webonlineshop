exports.addToCart = function() {
  return {
    controller: 'AddToCartController',
    // templateUrl: '/assessment/templates/add_to_cart.html'
    template: require('../public/templates/vidgets/add_to_cart.html')
  };
};  
 
exports.categoryProducts = function() { 
  return {
    controller: 'CategoryProductsController',
    // templateUrl: 'templates/category_products.html'
    template: require('../public/templates/vidgets/category_products.html')
  } 
}; 

exports.categoryTree = function() {
  return {
    controller: 'CategoryTreeController',
    // templateUrl: 'templates/category_tree.html'
    template: require('../public/templates/vidgets/category_tree.html')
  }
};

exports.checkout = function() {
  return {
    controller: 'CheckoutController',
    // templateUrl: 'templates/checkout.html'
    template: require('../public/templates/checkout.html')
  };
};

exports.likes = function() {
  return {
    controller: 'LikesController',
    // templateUrl: 'templates/checkout.html'
    template: require('../public/templates/likes.html')
  };
};

exports.navBar = function() {
  return {
    // transclude:true,
    restrict:'E',
    // require : '^searchBar',
    controller: 'NavBarController',
    // templateUrl: 'templates/nav_bar.html'
    template: require('../public/templates/vidgets/nav_bar.html')
  };
}; 

exports.productDetails = function() {
  return {
    controller: 'ProductDetailsController',
    // templateUrl: 'templates/product_details.html'
    template: require('../public/templates/vidgets/product_details.html')
  };
};

exports.searchBar = function() {
  return { 
    // transclude:true,
    restrict:'E', 
    // require : '^navBar',
    controller: 'SearchBarController',
    // templateUrl: '/templates/search_bar.html'
    template: require('../public/templates/vidgets/search_bar.html')
  };
};
 
exports.loginModal = function() {
  return {   
    restrict:'E',  
    // require : '^navBar',
    controller: 'LoginController',
    // templateUrl: '/templates/modal.html' 
     template: require('../public/templates/vidgets/login_btn.html')
  };
}; 


exports.mainNav = function() {
  return {   
    restrict:'E',  
    controller: 'MainNavController',
    // templateUrl: '/templates/modal.html' 
     template: require('../public/templates/vidgets/Main_nav.html')
  };
}; 

exports.slider = function() {
  return {   
    restrict:'E',  
    controller: 'SliderController',
    // templateUrl: '/templates/modal.html' 
     template: require('../public/templates/vidgets/slider.html')
  };
}; 

exports.bestSellers = function() {
  return {   
    restrict:'E',  
    controller: 'bestSellersController',
    // templateUrl: '/templates/modal.html' 
     template: require('../public/templates/vidgets/best_sellers.html')
  };
}; 

exports.recentlyViewed = function() {
  return {   
    restrict:'E',  
    controller: 'recentlyViewedController',
    // templateUrl: '/templates/modal.html' 
     template: require('../public/templates/vidgets/recently_viewed.html')
  };
}; 

exports.footerBlock = function() {
  return {   
    restrict:'E',  
    controller: 'footerBlockController',
     template: require('../public/templates/vidgets/footer_block.html')
  };
}; 

  