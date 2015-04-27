'use strict';
var controlls = angular.module( 'wcControlls', [] );

controlls.controller( 'LeftController',
  [ '$mdSidenav', 'ModelService', 'UserDataFactory', 'DataUpdaterService', 'wcEvents', '$scope',
    function ( $mdSidenav,
               ModelService,
               UserDataFactory,
               DataUpdaterService,
               wcEvents,
               $scope ) {
      var utils = {
        format: wcDataUtils.format,
        target: wcDataUtils.target
      };

      $scope.data = utils.format.Activity( UserDataFactory.getUserActivity(),
        utils.target.SCULPTURE );
      $scope.keys = $scope.data !== undefined ? Object.keys( $scope.data ) : [ 'Loading Data' ];

      $scope.selected = {
        indices: [],
        data: []
      };

      function updateSculpture () {
        $scope.uiGeoParams[ "radialSegments" ] = $scope.selected.data.length !== 1 ? $scope.selected.data.length - 1 : $scope.selected.data.length;
        $scope.uiGeoParams[ "heightSegments" ] = $scope.selected.data[ 0 ].length - 1;


        ModelService.updateMesh( $scope.uiGeoParams, $scope.uiMatParams );
      }

      $scope.toggle = function ( item, list, index ) {
        var idx = index.indexOf( item );
        if ( idx !== -1 ) {
          index.splice( idx, 1 );
          list.splice( idx, 1 );
          updateSculpture();
          //ModelService.addModel( $scope.uiGeoParams, $scope.uiMatParams );
        } else {
          index.push( item );
          list.push( $scope.data[ item ] );
          updateSculpture();
          //ModelService.addModel( $scope.uiGeoParams, $scope.uiMatParams );
        }
      };

      $scope.exists = function ( item, index ) {
        if ( index.indexOf( item ) !== -1 ) {
          return true;
        } else {
          return false;
        }
      };

      $scope.uiMatParams = {
        color: '#fffe00',
        shininess: 3,
        wireframe: false,
        linewidth: 1
      };

      $scope.uiGeoParams = {
        data: $scope.selected.data,
        //keys: $scope.selected.keys,
        outerRadius: 30,
        innerRadius: 40,
        height: 100,
        interpolate: false,
        definition: 50
      };

      $scope.sliderParams = {
        radialSegments: {
          min: 1,
          max: $scope.selected.data.length -1
        },
        heightSegments: {
          min: 1,
          max: $scope.data[ $scope.keys[ 0 ] ].length - 1
        },
        shininess: {
          min: 3,
          max: 15
        },
        linewidth: {
          min: 0,
          max: 5
        },
        definition: {
          step: 1,
          min: 10,
          max: 100
        }
      };


      $scope.onUiParamsChange = function () {
        ModelService.updateMesh( $scope.uiGeoParams, $scope.uiMatParams );
      }
    }
  ]
)
;
