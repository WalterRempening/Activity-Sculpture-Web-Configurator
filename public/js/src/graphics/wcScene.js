(function () {
  var scene = angular.module('wcScene', []);

  scene.service('SceneService', function () {
    return {
      scene: new THREE.Scene()
    };
  });
})();