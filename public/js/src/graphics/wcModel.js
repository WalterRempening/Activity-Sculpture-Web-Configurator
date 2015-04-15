(function() {
  'use strict';
  var model = angular.module('wcModel', []);

  model.service('ModelService',
    ['SceneService','UserDataFactory', function(SceneService, UserDataFactory) {

      var cmaterial = new THREE.MeshPhongMaterial({
        shading: THREE.SmoothShading,
        color: 0xfffe00,
        ambient: 0xfaeb07,
        emissive: 0x000000,
        specular: 0xffffff,
        shininess: 1
      });

      var cube = new THREE.Mesh(
        new THREE.BoxGeometry(40, 40, 40),
        cmaterial
      );

      //cube.castShadow = true;
      //console.log(UserDataFactory.getUserProfile());

      this.addModel = function() {
        SceneService.scene.add(cube);
        //ApiService.getData().then(function(data) {
        //  // do something with the data
        //  // this is going to be the place where the model is going to be build
        //});

      };

      this.scale = {
        x: 1,
        y: 1,
        z: 1
      };

      this.rotate = false;

      var rotationY = 0;
      var rotationSpeed = 0;

      this.update = function(delta) {

        if (this.rotate) {
          rotationSpeed = delta * 0.2;
          //rotationSpeed += Math.sin(Math.PI/8) * 0.009;
        }
        else {
          rotationSpeed = 0;
        }

        rotationY += rotationSpeed;
        cube.rotation.y = rotationY;

        cube.scale.set(this.scale.x, this.scale.y, this.scale.z);
      };


    }]);
})();
