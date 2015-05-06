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

          if ( geoArgs.showLables ) {
            var legendMat = new THREE.MeshBasicMaterial( {
              shading: THREE.FlatShading,
              color: 0xb4b4b4,
              side: THREE.DoubleSide
            } );
            var radius = geoArgs.outerRadius + 55;
            var circleLegend = new THREE.Mesh(
              new THREE.RingGeometry( radius, radius + 1, 70, 2, 2,
                6.283185307179586 ),
              legendMat
            );

            circleLegend.rotateX( -Math.PI / 2 );
            circleLegend.position.y = -geoArgs.height / 2;
            sculpture.add( circleLegend );

            var tags = [];
            for ( var w = 0; w < geoArgs.keys.length; w++ ) {
              tags.push( new THREE.Mesh(
                new THREE.TextGeometry( geoArgs.keys[ w ].toUpperCase(), {
                  size: 7,
                  height: 0,
                  curveSegments: 2
                } ),
                legendMat
              ) );
              tags[ w ].rotateX( -Math.PI / 2 );
              tags[ w ].rotateZ( (-Math.PI / 2) + ( w * ((-2 * Math.PI) / (geoArgs.keys.length))) );
              tags[ w ].position.x = (10 + radius) * Math.sin( (w / geoArgs.keys.length) * (-2 * Math.PI) );
              tags[ w ].position.y = -geoArgs.height / 2;
              tags[ w ].position.z = (10 + radius) * Math.cos( (w / geoArgs.keys.length) * (-2 * Math.PI) );

              sculpture.add( tags[ w ] );

            }
          }
          return sculpture;
        }

        var sculpture;
        this.addModel = function ( geoArgs, matArgs ) {
          sculpture = makeSculpture( geoArgs, matArgs );
          SceneService.scene.add( sculpture );
        };

        this.updateMesh = function ( geoArgs, matArgs ) {
          var oldSculpture = SceneService.scene.getObjectByName( 'vase' );
          if ( oldSculpture !== undefined ) {
            SceneService.scene.remove( oldSculpture );
          }
          sculpture = makeSculpture( geoArgs, matArgs );
          SceneService.scene.add( sculpture );

        };

        this.removeMesh = function () {
          var oldSculpture = SceneService.scene.getObjectByName( 'vase' );
          if ( oldSculpture !== undefined ) {
            SceneService.scene.remove( oldSculpture );
          }
        };


        var stlwriter = wcBinarySTLWriter.save;

        this.saveToSTL = function (name) {
          var configSculpture = SceneService.scene.getObjectByName( 'vase' );
          var file = name + ".stl";
          if ( configSculpture !== undefined ) {
            var geometry = configSculpture.geometry;
            stlwriter( geometry, file );

          }
        };

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
