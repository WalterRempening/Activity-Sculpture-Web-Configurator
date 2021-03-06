/**
 * Main class for Angular App
 * Load Angular modules
 * Configure UI Routes
 * Handles route transitions
 */

'use strict';
var app = angular.module( 'MainApp',
  [ 'ngAnimate',
    'ngMaterial',
    'ngCookies',
    'ui.router',
    'mp.colorPicker',
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
    'wcViewport' ]
);

app.config(
  [ '$stateProvider',
    '$urlRouterProvider',
    '$urlMatcherFactoryProvider',
    '$httpProvider',
    '$mdThemingProvider',
    function ( $stateProvider,
               $urlRouterProvider,
               $urlMatcherFactoryProvider,
               $httpProvider,
               $mdThemingProvider ) {

      // Setup angular material theme
      $mdThemingProvider.theme( 'default' )
        .primaryPalette( 'blue' )
        .accentPalette( 'yellow' )
        .warnPalette( 'pink' )
        .backgroundPalette( 'grey' );

      $urlRouterProvider.otherwise( function ( $injector, $location ) {
          var state = $injector.get( '$state' );
          state.go( 'home' );
          return $location.path();
        }
      );

      // Publi routes
      $stateProvider.state( 'home', {
        url: '/',
        views: {
          '': { templateUrl: '../../views/core/landing-page.html' },
          'tutorial@home': { templateUrl: '../../views/core/tutorial-partial.html' },
          'about@home': { templateUrl: '../../views/core/about-partial.html' }
        },
        // Display consent dialog when entering the homepage
        onEnter: [ '$window', '$mdDialog', function ( $window, $mdDialog ) {

          $mdDialog.show( {
            controller: ConsentController,
            templateUrl: '../../../views/core/welcome.tmpl.html',
            escapeToClose: false,
            clickOutsideToClose: false
          } )
            .then( function ( save ) {
              // move on
            }, function () {
              //$state.go( '404' );
              // Go watch some kittens instead
              $window.location.href = 'https://www.youtube.com/results?search_query=kittens&page=&utm_source=opensearch';
            } );

          function ConsentController ( $scope, $mdDialog ) {
            $scope.agree = function ( save ) {
              $mdDialog.hide();
            };
            $scope.cancel = function () {
              $mdDialog.cancel();
            }
          }
        } ]

      } ).state( '404', {
        url: '/404',
        templateUrl: '../../views/core/404.html'
      } );

      // User routes
      $stateProvider.state( 'configurator', {
        url: '/user/{userid}/configurator/{sculpture}',
        templateUrl: '../../views/configurator/configurator-page.html'
      } )
        .state( 'settings', {
          url: '/user/{userid}',
          // Display setup window if user is new
          onEnter: [ '$mdDialog', '$stateParams', '$state', '$cookieStore', 'UserDataFactory',
                     function ( $mdDialog, $stateParams, $state, $cookieStore,
                                UserDataFactory ) {
                       var params = {};
                       // Check for user settings
                       UserDataFactory.queryUserSettings( function ( data ) {
                         if ( data !== 'undefined' ) {
                           $state.go( 'dashboard' );
                         } else {

                           $mdDialog.show( {
                             controller: SetupController,
                             templateUrl: '../../../views/dashboard/setup-form.tmpl.html',
                             escapeToClose: false,
                             clickOutsideToClose: false
                           } )
                             .then( function ( save ) {
                               if ( save ) {
                                 UserDataFactory.saveUserSettings( params );
                                 $cookieStore.put( 'settings', params );
                                 $state.go( 'dashboard' );
                               }
                             }, function () {
                               $state.go( 'home' );
                             } );
                         }
                       } );

                       function SetupController ( $scope, $mdDialog ) {
                         $scope.settings = {
                           age: '',
                           gender: '',
                           country: '',
                           city: '',
                           startDate: '',
                           endDate: new Date( Date.now() ),
                           show: true
                         };

                         $scope.submit = function ( save ) {
                           $mdDialog.hide( save );
                           params = $scope.settings;
                         };
                       }
                     } ]
        } )
        .state( 'dashboard', {
          templateUrl: '../../views/dashboard/dashboard.html',
          controller: 'DashboardController'
        } );

      $httpProvider.interceptors.push( function ( $q, $location ) {
        return {
          'responseError': function ( response ) {
            if ( response.status === 401 || response.status === 403 ) {
              $location.path( '/' );
            }
            return $q.reject( response );
          }
        };
      } );
    } ] );

// Force refreshing dashboard if returning from configurator (quickfix)
// TODO bugfix: configurator keeps rendering when returning to dashboard
app.run(
  [ '$rootScope', '$urlRouter', '$window', '$state',
    function ( $rootScope, $urlRouter, $window, $state ) {
      $rootScope.$on( '$stateChangeSuccess',
        function ( event, toState, toParams, fromState, fromParams ) {
          if ( fromState.name == 'configurator' && toState.name == 'settings' ) {
            event.preventDefault;
            console.log( 'reload window' );
            $window.location.reload();
          }
        } );
      $urlRouter.listen();
    } ] );