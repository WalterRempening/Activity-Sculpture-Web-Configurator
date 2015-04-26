(function () {
  var camera = angular.module( 'wcCamera', [] );

  camera.service( 'CameraService', function () {

    var viewAngle = 50;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var near = 1;
    var far = 1000;

    return {
      perspectiveCam: new THREE.PerspectiveCamera( viewAngle, aspectRatio, near,
        far )
    };
  } );
})();