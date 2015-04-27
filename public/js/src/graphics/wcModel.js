(function ( angular ) {
  'use strict';
  angular.module( 'wcModel', [] )

  .service( 'ModelService',
    [ 'SceneService',
      function ( SceneService ) {

        var SCULPTURE_NAME = 'vase';

        function makeSculpture ( geoArgs, matArgs ) {
          var sculpture = new THREE.Mesh(
            new WCVaseGeometry(
              geoArgs.data,
              geoArgs.outerRadius,
              geoArgs.innerRadius,
              geoArgs.height,
              geoArgs.radialSegments,
              geoArgs.heightSegments,
              geoArgs.definition,
              geoArgs.interpolate
            ),
            new THREE.MeshPhongMaterial( {
              shading: THREE.FlatShading,
              color: matArgs.color,
              ambient: 0xfaeb07,
              emissive: 0x000000,
              specular: 0xffffff,
              shininess: matArgs.shininess,
              wireframe: matArgs.wireframe,
              wireframeLinewidth: matArgs.linewidth
            } )
          );
          sculpture.castShadow = true;
          sculpture.name = SCULPTURE_NAME;

          return sculpture;
        }

        var sculpture;
        this.addModel = function ( geoArgs, matArgs ) {
          sculpture = makeSculpture( geoArgs, matArgs );
          SceneService.scene.add( sculpture );
        };

        this.updateMesh = function ( geoArgs, matArgs ) {
          var oldSculpture = SceneService.scene.getObjectByName( 'vase' );
          SceneService.scene.remove( oldSculpture );
          sculpture = makeSculpture( geoArgs, matArgs );
          SceneService.scene.add( sculpture );
        }

        var rotationY = 0;
        var rotationSpeed = 0;
        this.rotate = false;

        this.update = function ( delta ) {
          //if ( this.rotate ) {
          //  rotationSpeed = delta * 0.2;
          //}
          //else {
          //  rotationSpeed = 0;
          //}
          //
          //rotationY += rotationSpeed;
          //sculpture.rotation.y = rotationY;
        };


      } ] );
})( angular );
