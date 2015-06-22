/**
 * Threejs Camera Service
 */

(function ( angular ) {
  'use strict';
  angular.module( 'wcCamera', [] )
    .service( 'CameraService', function () {

      // Configure camera
      var viewAngle = 50;
      var aspectRatio = window.innerWidth / window.innerHeight;
      var near = 1;
      var far = 1000;

      return {
        perspectiveCam: new THREE.PerspectiveCamera( viewAngle, aspectRatio,
          near,
          far )
      };
    } );
})( angular );