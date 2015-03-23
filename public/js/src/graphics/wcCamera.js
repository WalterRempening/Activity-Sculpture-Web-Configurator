(function() {
  var camera = angular.module('wcCamera', []);

  camera.service('CameraService', function() {

    var viewAngle = 45;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var near = 0.1;
    var far = 15000;

    return {
      perspectiveCam: new THREE.PerspectiveCamera(viewAngle, aspectRatio, near,
        far)
    };
  });
})();