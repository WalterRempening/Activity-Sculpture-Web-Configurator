(function() {
  'use strict';
  var app = angular.module('MainApp',
    ['ngAnimate',
     'ngMaterial',
     'ui.router',
     'wcApi',
     'wcLander',
     'wcFooter',
     'wcControlls',
     'wcDashboard',
     'wcScene',
     'wcCamera',
     'wcModel',
     'wcViewport']
  );

  app.config(
    ['$stateProvider',
     '$urlRouterProvider',
     '$urlMatcherFactoryProvider',
     '$mdThemingProvider',
     function($stateProvider,
              $urlRouterProvider,
              $urlMatcherFactoryProvider,
              $mdThemingProvider) {

       $mdThemingProvider.theme('default')
         .primaryPalette('blue')
         .accentPalette('yellow')
         .warnPalette('pink')
         .backgroundPalette('grey');

       $urlRouterProvider.otherwise(function($injector, $location) {
           var state = $injector.get('$state');
           state.go('home');
           return $location.path();
         }
       );

       $stateProvider.state('home', {
         url: '/',
         views: {
           '': {templateUrl: '../views/core/landing-page.html'},
           'tutorial@home': {templateUrl: '../views/core/tutorial-partial.html'},
           'about@home': {templateUrl: '../views/core/about-partial.html'}
         }
       })
         .state('configurator', {
           url: '/config',
           templateUrl: '../views/configurator/configurator-page.html'
         })
         .state('withings-flow', {
           url: '/user/{userid}',
           templateUrl: '../views/login/dashboard.html'
         })
         .state('404', {
           url: '/404',
           templateUrl: '../views/core/404.html'
         });
     }]
  );

})();