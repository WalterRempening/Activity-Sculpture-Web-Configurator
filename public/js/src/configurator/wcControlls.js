'use strict';
var controlls = angular.module( 'wcControlls', [] );

controlls.controller( 'LeftController',
  [ '$mdSidenav', 'ModelService', 'UserDataFactory', 'DataUpdaterService', 'wcEvents', '$scope',
    function ( $mdSidenav,
               ModelService,
               UserDataFactory,
               DataUpdaterService,
               wcEvents, $scope ) {
      var utils = {
        format: wcDataUtils.format,
        target: wcDataUtils.target
      };

      $scope.data = utils.format.Activity( UserDataFactory.getUserActivity(),
        utils.target.SCULPTURE );
      $scope.$watch( 'data', function ( newVal, oldVal ) {
        if ( newVal != oldVal ) {
          $scope.data = utils.format.Activity( UserDataFactory.getUserActivity(),
            utils.target.SCULPTURE );
        }
      } );


      $scope.selected = [];

      $scope.toggle = function ( item, list ) {
        var idx = list.indexOf( item );
        if ( idx > -1 ) list.splice( idx, 1 );
        else list.push( item );
      };

      $scope.exists = function ( item, list ) {
        if ( list.indexOf( item ) > -1 ) {
          return true;
        } else {
          return false;
        }
      };


      this.uiMatParams = {
        color: '#fffe00',
        shininess: 3,
        wireframe: false,
        linewidth: 1
      };

      this.uiGeoParams = {
        data: $scope.data.values,
        outerRadius: 30,
        innerRadius: 40,
        height: 100,
        radialSegments: $scope.data.values.length - 1,
        heightSegments: $scope.data.values[ 0 ].length - 1,
        definition: (($scope.data.values.length - 1 ) * 10),
        interpolate: false
      };

      this.sliderParams = {
        radialSegments: {
          min: 1,
          max: $scope.data.values.length - 1
        },
        heightSegments: {
          min: 1,
          max: $scope.data.values[ 0 ].length - 1
        },
        definition: {
          step: this.uiGeoParams.radialSegments,
          min: this.uiGeoParams.radialSegments,
          max: this.uiGeoParams.definition
        },
        shininess: {
          min: 3,
          max: 15
        },
        linewidth: {
          min: 0,
          max: 5
        }
      };

      ModelService.addModel( this.uiGeoParams, this.uiMatParams );

      this.onUiParamsChange = function () {
        ModelService.updateMesh( this.uiGeoParams, this.uiMatParams );
      }

      this.toggle = {
        rotate: false
      }

      this.onRotateToggle = function () {
        ModelService.rotate = this.toggle.rotate;
      };

    }
  ]
);
