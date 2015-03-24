(function() {
  var model = angular.module('wcModel', ['wcSocket']);

  model.service('ModelService',
    ['SceneService', 'ApiService', function(SceneService, ApiService) {

      var cube = new THREE.Mesh(
        new THREE.BoxGeometry(40, 40, 40),
        new THREE.MeshNormalMaterial()
      );


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

      this.rotate = true;

      var rotationY = 0;
      var rotationSpeed = 0;

      this.update = function() {

        if (this.rotate) {
          rotationSpeed += Math.sin(Math.PI/8) * 0.009;
        } else {
          rotationSpeed = rotationSpeed;
        }

        rotationY = rotationSpeed;
        cube.rotation.y = rotationY;

        cube.scale.set(this.scale.x, this.scale.y, this.scale.z);
      };


    }]);
})();
