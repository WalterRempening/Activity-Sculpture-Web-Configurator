(function() {
  'use strict';
  var viewport = angular.module('wcViewport', []);
  viewport.directive('threeViewport',
    ['SceneService', 'CameraService', 'ModelService',
     function(SceneService, CameraService, ModelService) {

       function canvas(scope, element, attribute) {
         var renderer;
         var controls;
         var stats = new Stats();

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
           console.log('Im working');
           stats.begin();
           renderer.render(SceneService.scene, CameraService.perspectiveCam);
           ModelService.update();
           controls.update();
           stats.end();
           requestAnimationFrame(animate);
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

       function destroy(){
         SceneService.destroy();
       }


       return {
         restrict: 'E',
         link: canvas

       };
     }]
  );

}());