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
           //renderer.shadowMapEnabled = true;
           // set up the controls with the camera and renderer
           controls = new THREE.OrbitControls(CameraService.perspectiveCam,
             renderer.domElement
           );

           // init world scenary
           SceneService.scene.fog = new THREE.Fog(0x454545, 4849, 5976.44);

           var ambientLight = new THREE.AmbientLight(0x000000);
           SceneService.scene.add(ambientLight);

           var directionalLight = new THREE.DirectionalLight(0xffffff, 0.65);
           directionalLight.position.set(1, 1, 1);
           directionalLight.castShadow = true;
           SceneService.scene.add(directionalLight);

           var wgeometry = new THREE.PlaneBufferGeometry(1000, 1000, 50, 50);
           var wmaterial = new THREE.MeshBasicMaterial({
             color: 0xFFFFFF
           });

           var plane = new THREE.Mesh(wgeometry);
           plane.rotation.x = -Math.PI / 2;
           plane.position.y = -20;
           plane.scale.set(2, 2, 2);
           plane.visible = false;

           var wireplane = new THREE.EdgesHelper(plane, 0xb3b3b3, 0);
           wireplane.material.linewidth = 0.7;

           SceneService.scene.add(plane);
           SceneService.scene.add(wireplane);

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