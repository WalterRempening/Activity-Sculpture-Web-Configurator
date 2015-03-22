(function () {
  'use strict';
  var app = angular.module('MainApp', ['ui.router',
                                       'ngAnimate',
                                       'ngMaterial',
                                       'wcApi',
                                       'wcMenu',
                                       'wcFooter',
                                       'wcScene',
                                       'wcCamera']);

  app.config(['$stateProvider',
              '$urlRouterProvider',
              '$mdThemingProvider',
              function ($stateProvider,
                        $urlRouterProvider,
                        $mdThemingProvider) {

                $mdThemingProvider.theme('default')
                  .primaryPalette('blue')
                  .accentPalette('yellow')
                  .warnPalette('pink')
                  .backgroundPalette('grey');

                $urlRouterProvider.otherwise(function ($injector, $location) {
                  var state = $injector.get('$state');
                  state.go('404');
                  return $location.path();
                });

                $stateProvider
                  .state('home', {
                    url: '/',
                    views:{
                      '': {templateUrl:'../views/core/landing-page.html'},
                      'tutorial@home' : {templateUrl:'../views/core/tutorial-partial.html'},
                      'about@home': {templateUrl: '../views/core/about-partial.html'}
                    }
                  })
                  .state('tutorial', {
                    url: '/tutorial',
                    templateUrl: '../views/core/tutorial-partial.html'
                  })
                  .state('about', {
                    url: '/about',
                    templateUrl: '../views/core/about-partial.html'
                  })
                  .state('configurator', {
                    url: '/config',
                    templateUrl: '../views/configurator/configurator-page.html'
                  })
                  .state('404', {
                    templateUrl: '../views/core/404.html'
                  });

              }]);

})();


