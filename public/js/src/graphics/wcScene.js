/**
 * Threejs Scene Service
 */

(function ( angular ) {
  'use strict';
  angular.module( 'wcScene', [] )

    .service( 'SceneService', function () {
      this.scene = new THREE.Scene();

      return {
        scene: this.scene
      };
    } );
})( angular );