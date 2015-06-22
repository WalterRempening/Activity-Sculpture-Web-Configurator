/**
 * Landing page Controller
 * Starts oAuth flow
 */
(function ( angular ) {
  'use strict';
  angular.module( 'wcLander', [] )

    .controller( 'MenuController', [ function () { } ] )

    .controller( 'OauthController',
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

})( angular );


