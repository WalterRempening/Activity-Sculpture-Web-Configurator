(function() {
  'use strict';
  var viewport = angular.module('wcViewport', []);
  viewport.directive('threeViewport',
    ['SceneService', 'CameraService', 'ModelService',
     function(SceneService, CameraService, ModelService) {

       function canvas(scope, element, attribute) {
         var renderer;
         var controls;
         var delta;
         var INV_MAX_FPS = 1 / 60;
         var stats = new Stats();
         var clock = new THREE.Clock();
         clock.start();

         init();
         animate();

         function init() {
           console.log("initation called");
           // Add statistics monitor
           stats.setMode(0);
           stats.domElement.style.position = 'absolute';
           stats.domElement.style.right = '0px';
           stats.domElement.style.top = '0px';
           document.body.appendChild(stats.domElement);
           // Add Camera
           CameraService.perspectiveCam.position.set(0, 0, 200);
           SceneService.scene.add(CameraService.perspectiveCam);
           // Create Renderer
           renderer = new THREE.WebGLRenderer({antialias: true});
           renderer.setSize(element[0].offsetWidth, element[0].offsetHeight);
           renderer.setClearColor(0xFFFFFF, 1);
           // set up the controls with the camera and renderer
           controls = new THREE.OrbitControls(CameraService.perspectiveCam,
             renderer.domElement
           );

           // Disable zooming with mouse scroll
           controls.noZoom = true;
           // add renderer to DOM
           element[0].appendChild(renderer.domElement);
           // handle window resizing
           window.addEventListener('resize', onWindowResize, false);
         }

         function animate() {
           requestAnimationFrame(animate);
           stats.begin();
           render();
           stats.end();
         }

         function render() {
           delta = clock.getDelta();
           console.log(delta + " : " + INV_MAX_FPS);
           while (delta >= INV_MAX_FPS) {
             renderer.render(SceneService.scene, CameraService.perspectiveCam);
             ModelService.update(INV_MAX_FPS);
             controls.update(INV_MAX_FPS);
             delta -= INV_MAX_FPS;
           }
         }

         function onWindowResize() {
           renderer.setSize(element[0].offsetWidth, element[0].offsetHeight);
           CameraService.perspectiveCam.aspect = window.innerWidth / window.innerHeight;
           CameraService.perspectiveCam.updateProjectionMatrix();
         }


         scope.$on('$destroy', function() {
           //destroy();
           console.log('Destroy');
         });


       };

       function destroy() {
         SceneService.destroy();
       }


       return {
         restrict: 'E',
         link: canvas

       };
     }]
  );
}());