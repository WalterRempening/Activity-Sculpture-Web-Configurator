(function() {
  'use strict';
  var viewport = angular.module('wcViewport', []);
  viewport.directive('threeViewport',
    ['SceneService', 'CameraService','ModelService',
     function(SceneService, CameraService, ModelService) {

      return {
        restrict: 'E',
        link: function(scope, element, attribute) {
          var renderer;
          var controls;

          init();
          animate();

          function init() {
            // Add Camera
            CameraService.perspectiveCam.position.set(0, 0, 200);
            SceneService.scene.add(CameraService.perspectiveCam);
            // Create Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0xFFFFFF, 1);
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
            ModelService.update();
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