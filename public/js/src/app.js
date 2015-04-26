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

      // Public routes
      $stateProvider.state( 'home', {
        url: '/',
        views: {
          '': { templateUrl: '../../views/core/landing-page.html' },
          'tutorial@home': { templateUrl: '../../views/core/tutorial-partial.html' },
          'about@home': { templateUrl: '../../views/core/about-partial.html' }
        },
        onEnter: [ '$state', '$mdDialog', function ( $state, $mdDialog ) {

          $mdDialog.show( {
            controller: ConsentController,
            templateUrl: '../../../views/core/welcome.tmpl.html',
            escapeToClose: false,
            clickOutsideToClose: false
          } )
            .then( function ( save ) {
              // move on
              $state.go( '404' );
            }, function () {

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
        url: '/user/{userid}/configurator/',
        views: {
          '': { templateUrl: '../../views/configurator/configurator-page.html' },
          'left-panel@configurator': { templateUrl: '../../views/configurator/left-panel.html' },
          'right-panel@configurator': { templateUrl: '../../views/configurator/right-panel.html' },
          'bottom-panel@configurator': { templateUrl: '../../views/configurator/bottom-panel.html' }
        }
      } )
        .state( 'settings', {
          url: '/user/{userid}',
          onEnter: [ '$mdDialog', '$stateParams', '$state', '$cookieStore', 'UserDataFactory',
                     function ( $mdDialog, $stateParams, $state, $cookieStore,
                                UserDataFactory ) {
                       var params = {};
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