//require('angular');
var carousel  = require('angular-carousel');
var controllers = require('./controllers');
var directives = require('./directives');
var services = require('./services');
var _ = require('underscore');
require('angular-jwt');
require('angular-css');


angular.module('mean.users', ['ng', "angular-jwt", "ngCookies"]);

//includes auth front lib and mean.users angular app:
var req = require.context('../../node_modules/meanio-users/public/controllers', true, /\.js$/);
    req.keys().map(req);
    req = require.context('../../node_modules/meanio-users/public/routes', true, /\.js$/);
    req.keys().map(req);
    req = require.context('../../node_modules/meanio-users/public/services', true, /\.js$/);
    req.keys().map(req);

     
// var auth_app = require('./auth-app'); 
if (process.env.NODE_ENV != 'production') {
  //added for webpack watch changes in html
  require('../public/templates/users/register.html');
}

var components = angular.module('mean-retail.components', ['ng', 'angularCSS']);

_.each(controllers, function(controller, name) {
  components.controller(name, controller);
});


_.each(directives, function(directive, name) {
  components.directive(name, directive);
});


_.each(services, function(factory, name) {
  components.factory(name, factory);
});

/*this creates services using the .factory() function.
here we register service (it can be any function) and then
we can use it in any controller after typing dependency on this
service in controller definition
(all controllers live in injector object (like in wagner) 
and if they dependent on some service it must be written 
as a parametr in controller function definition)
*/

var app = angular.module('mean-retail', ['mean-retail.components', 
  'mean.users', 
  //'ngRoute', 
  'ngAnimate', 'ngSanitize','ui.bootstrap', 
  'ui.router',
  'ngMaterial', 'ngAria', 'angular-carousel', 'angularCSS']);

app.config(function($stateProvider) {


  $stateProvider.state({
    name: 'home',
    url: '',
    // template: '<checkout></checkout>'
    template: require('../public/templates/home_view.html')
  });

  $stateProvider.state({
    name: 'home1',
    url: '/',
    template: require('../public/templates/home_view.html'),
    controller: 'RedirectController'
  });

  $stateProvider.state({
    name: 'home2',
    url: '/_=_',
    template: require('../public/templates/home_view.html'),
    controller: 'RedirectController'
  });

  $stateProvider.state({
    name: 'blog_single',
    url: '/blog_single',
    template: require('../public/templates/blog_single.html'),
    controller: 'BlogSingleController'
  });

  $stateProvider.state({
    name: 'about',
    url: '/about',
    template: require('../public/templates/about.html'),
    controller: 'AboutController'
  });

  $stateProvider.state({
    name: 'checkout',
    url: '/checkout',
    template: '<checkout></checkout>'
  });

  $stateProvider.state({
    name: 'likes',
    url: '/likes', 
    template: '<likes></likes>'
  });

  $stateProvider.state({
    name: 'category',
    url: '/category/:category',
    template: require('../public/templates/category_view.html')
  });
 
  $stateProvider.state({
    name: 'product',
    url: '/product/:id', 
    template: require('../public/templates/product_view.html')
  });

  if (process.env.NODE_ENV != 'production') {
    $stateProvider.state({
      name: 'login',
      url: '/login',
      stateparams:{ LoginTemplateUrl :'templates/users/index.html',
      card:"Log in"},
      template: '<login-modal></login-modal>'
    });
  }  
  else{
    $stateProvider.state({
      name: 'login',
      url: '/login',
      stateparams:{ LoginTemplateUrl :'templates/users/hello.html',
      card:"Log in"},
      template: '<login-modal></login-modal>'
    });
  };
  console.log("process.env.NODE_ENV = "+process.env.NODE_ENV);

  $stateProvider.state({
    name: 'signin',
    url: '/signin',
    stateparams:{ LoginTemplateUrl :'templates/users/login.html',
                  card:"Sign in"},
    template: '<login-modal></login-modal>',
  });
  $stateProvider.state({
    name: 'register',
    url: '/register',
    stateparams:{ LoginTemplateUrl :'templates/users/register.html',
                  card:"Register"},
    template: '<login-modal></login-modal>'
  });
  $stateProvider.state({
    name: 'forgot-password',
    url: '/forgot',
    stateparams:{ LoginTemplateUrl :'templates/users/forgot-password.html',
                  card:"Forgot Password"},
    template: '<login-modal></login-modal>'
  });
  $stateProvider.state({
    name: 'reset',
    url: '/reset/:tokenId',
    stateparams:{ LoginTemplateUrl :'templates/users/reset-password.html',
                  card:"Reset password"},
    template: '<login-modal></login-modal>'
  });
  
}); 
 