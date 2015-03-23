(function() {
  var model = angular.module('wcModel', ['wcSocket']);

  model.service('ModelService',
    ['SceneService', 'ApiService', function(SceneService, ApiService) {
      this.addModel = function() {
        //ApiService.getData().then(function(data) {
        //  // do something with the data
        //  // this is going to be the place where the model is going to be build
        //});

        var cube = new THREE.Mesh(
          new THREE.BoxGeometry(40, 40, 40),
          new THREE.MeshNormalMaterial()
        );

        SceneService.scene.add(cube);

      };
    }]);
})();
