(function () {
  var scene = angular.module( 'wcScene', [] );

  scene.service( 'SceneService', function () {
    this.scene = new THREE.Scene();

    return {
      scene: this.scene
    };
  } );
})();