/**
 * Main Page Footer Directive
 */

(function ( angular ) {
  'use strict';
  angular.module( 'wcFooter', [] )
    .controller( 'FooterController', function () {
      this.year = new Date( Date.now() ).getFullYear();
    } )

    .directive( 'dwcFooter', function () {
      return {
        restrict: 'E',
        replace: 'true',
        templateUrl: '../../../views/core/footer-partial.html',
        controller: 'FooterController',
        controllerAs: 'ftrCtrl'
      };
    } );

})( angular );