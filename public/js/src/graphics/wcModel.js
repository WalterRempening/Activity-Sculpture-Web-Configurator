(function () {
  'use strict';
  var model = angular.module( 'wcModel', [] );

  model.service( 'ModelService',
    [ 'SceneService', 'UserDataFactory', 'DataUpdaterService',
      function ( SceneService, UserDataFactory, DataUpdaterService ) {

        var utils = {
          format: wcDataUtils.format,
          normal: wcDataUtils.normalize
        };

        this.matParams = {
          color: 0xfffe00
        };

        this.data = UserDataFactory.getUserActivity();
        DataUpdaterService.listenActivity( function ( data ) {
          this.data = data;
        } );

        this.geoParams = {
          data: utils.normal.Array(
            this.data.steps[ 1 ].values
            , 0, 20 ),
          outerRadius: 50,
          innerRadius: 40,
          height: 100,
          radialSegments: 100,
          heightSegments: 100
        };

        function makeSculpture ( geoArgs, matArgs ) {
          return new THREE.Mesh(
            new WCVaseGeometry(
              geoArgs.data,
              geoArgs.outerRadius,
              geoArgs.innerRadius,
              geoArgs.height,
              geoArgs.radialSegments,
              geoArgs.heightSegments
            ),
            new THREE.MeshPhongMaterial( {
              shading: THREE.FlatShading,
              color: matArgs.color,
              ambient: 0xfaeb07,
              emissive: 0x000000,
              specular: 0xffffff,
              shininess: 1
            } )
          );
        }

        var sculpture = makeSculpture( this.geoParams, this.matParams );

        this.addModel = function () {
          SceneService.scene.add( sculpture );
        };

        this.updateMesh = function () {
          SceneService.scene.remove( sculpture );
          sculpture = makeSculpture( this.geoParams, this.matParams );
          SceneService.scene.add( sculpture );
        }

        var rotationY = 0;
        var rotationSpeed = 0;
        this.rotate = false;

        this.update = function ( delta ) {

          if ( this.rotate ) {
            rotationSpeed = delta * 0.2;
            //rotationSpeed += Math.sin(Math.PI/8) * 0.009;
          }
          else {
            rotationSpeed = 0;
          }

          rotationY += rotationSpeed;
          sculpture.rotation.y = rotationY;

        };


      } ] );
})();
