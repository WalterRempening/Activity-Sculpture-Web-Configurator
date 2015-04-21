(function () {
  'use strict';
  var lander = angular.module( 'wcLander', [] );

  lander.controller( 'MenuController', [ function () {
    this.nav = {
      main: [ {
        name: 'Get Started',
        state: 'tutorial'
      }, {
        name: 'About',
        state: 'about'
      } ]
    }
  } ] );

  lander.controller( 'OauthController',
    [ '$window', '$cookies', '$http', function ( $window, $cookies, $http ) {
      this.startFlow = function () {
        if ( !$cookies.user ) {
          $window.location.href = "/auth/withings";
        } else {
          var user = JSON.parse( $cookies.user );
          $window.location.href = "/auth/withings/callback"
          //$http.get( '/auth/withings/callback' )
          //  .success( function ( data, status, headers, config ) {
          //
          //  } )
          //  .error( function ( data, status, headers, config ) {
          //
          //  } );
        }


      };
    } ] );

})();


