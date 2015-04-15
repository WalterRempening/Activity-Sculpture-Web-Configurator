'use strict';
var app = angular.module('MainApp',
  ['ngAnimate',
   'ngMaterial',
   'ngCookies',
   'ui.router',
   'nvd3',
   'wcGraphs',
   'wcLander',
   'wcFooter',
   'wcControlls',
   'wcDashboard',
   'wcScene',
   'wcCamera',
   'wcUserData',
   'wcSocket',
   'wcModel',
   'wcViewport']
);

app.config(
  ['$stateProvider',
   '$urlRouterProvider',
   '$urlMatcherFactoryProvider',
   '$httpProvider',
   '$mdThemingProvider',
   function($stateProvider,
            $urlRouterProvider,
            $urlMatcherFactoryProvider,
            $httpProvider,
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

     // Public routes
     $stateProvider.state('home', {
       url: '/',
       views: {
         '': {templateUrl: '../views/core/landing-page.html'},
         'tutorial@home': {templateUrl: '../views/core/tutorial-partial.html'},
         'about@home': {templateUrl: '../views/core/about-partial.html'}
       }
     }).state('404', {
       url: '/404',
       templateUrl: '../views/core/404.html'
     });

     // User routes
     $stateProvider.state('configurator', {
       url: '/config/{userid}',
       templateUrl: '../views/configurator/configurator-page.html'
     })
       .state('dashboard', {
         url: '/user/{userid}',
         templateUrl: '../views/dashboard/dashboard.html',
         controller: 'DashboardController'
       });


     $httpProvider.interceptors.push(function($q, $location) {
       return {
         'responseError': function(response) {
           if (response.status === 401 || response.status === 403) {
             $location.path('/');
           }
           return $q.reject(response);
         }
       };
     });
   }]);
