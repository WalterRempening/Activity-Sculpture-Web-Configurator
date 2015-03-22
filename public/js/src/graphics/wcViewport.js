(function () {
  var viewport = angular.module('wcViewport', []);

  viewport.directive('threeViewport',
    ['SceneService', 'CameraService', function (SceneService, CameraService) {

      return {
        restrict: 'AE',
        link: function (scope, element, attribute) {
          var renderer;
          var controls;

          init();
          animate();

          function init() {
            // Add Camera
            CameraService.perspectiveCam.position(0, 0, 200);
            SceneService.scene.add(CameraService.perspectiveCam);
            // Create Renderer
            renderer = new THREE.WebGLRenderer({antialias: true});
            render.setSize(window.innerWidth, window.innerHeight);
            // set up the controls with the camera and renderer
            controls = new THREE.OrbitControls(CameraService.perspectiveCam,
              renderer.domElement
            );
            // add renderer to DOM
            element[0].appendChild(renderer.domElement);
            // handle window resizing
            window.addEventListener('resize', onWindowResize, false);
          }

          function animate() {
            requestAnimationFrame(animate);
            renderer.render(SceneService.scene, CameraService.perspectiveCam);
            controls.update();
          }

          function onWindowResize() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            CameraService.perspectiveCam.aspect = window.innerWidth / window.innerHeight;
            CameraService.perspectiveCam.updateProjectionMatrix();
          }


        }

      };
    }]
  );
}());