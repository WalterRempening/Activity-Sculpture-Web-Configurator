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
       .state('settings', {
         url: '/user/{userid}',
         onEnter: ['$mdDialog', '$stateParams', '$state', '$cookieStore','$cookies',
                   function($mdDialog, $stateParams, $state, $cookieStore, $cookies) {
                     var params = {};

                     if (!$cookies.user) {
                       $state.go('dashboard');
                     } else {
                       $mdDialog.show({
                         controller: SetupController,
                         templateUrl: '../../../views/dashboard/setup-form.tmpl.html',
                         escapeToClose: false,
                         clickOutsideToClose: false
                       })
                         .then(function(save) {

                           if (save) {
                             $cookieStore.put('settings', params);
                             $state.go('dashboard');
                           }
                         }, function() {
                           $state.go('home');
                         });

                     }

                     function SetupController($scope, $mdDialog) {
                       $scope.settings = {
                         age : '',
                         gender : '',
                         country: '',
                         city: '',
                         startDate: '',
                         endDate: new Date(Date.now()),
                         show: true
                       };

                       $scope.submit = function(save) {
                         $mdDialog.hide(save);
                         params = $scope.settings;
                       };
                     }
                   }]
       })
       .state('dashboard', {
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
