(function () {
  'use strict';
  var controlls = angular.module( 'wcControlls', [] );

  controlls.controller( 'LeftController',
    [ '$timeout', '$mdSidenav', 'ModelService', '$log',
      function ( $timeout,
                 $mdSidenav,
                 ModelService ) {

        ModelService.addModel();

        this.toggleLeft = function () {
          $mdSidenav( 'left' ).toggle();
        };

        this.uiMatParams = {
          color: 0xfffe00
        }

        this.uiGeoParams = {
          outerRadius: 50,
          innerRadius: 40,
          height: 70,
          radialSegments: 40,
          heightSegments: 2
        };

        this.onUiGeoParamsChange = function ( key ) {
          ModelService.geoParams[ key ] = this.uiGeoParams[ key ];
          ModelService.updateMesh();
        }

        this.onUiMatParamsChange = function ( key ) {
          ModelService.matParams[ key ] = this.uiMatParams[ key ];
          ModelService.updateMesh();
        }


        this.toggle = {
          rotate: false
        }

        this.onRotateToggle = function () {
          ModelService.rotate = this.toggle.rotate;
        };


      } ]
  );
})();