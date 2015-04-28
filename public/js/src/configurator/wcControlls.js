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

      function processSculptureData ( usr ) {
        var data = {
          Activity: {
            name: "Activity",
            keys: [],
            values: []
          },
          Sleep: {
            name: "Sleep",
            keys: [],
            values: []
          },
          Body: {
            name: "Body",
            keys: [],
            values: []
          }
        };
        data.Activity.values = utils.format.Activity( usr[ 0 ],
          utils.target.SCULPTURE );
        data.Activity.keys = Object.keys( data.Activity.values );
        data.Sleep.values = utils.format.Sleep( usr[ 1 ],
          utils.target.SCULPTURE );
        data.Sleep.keys = Object.keys( data.Sleep.values );
        data.Body.values = utils.format.Body( usr[ 2 ],
          utils.target.SCULPTURE );
        data.Body.keys = Object.keys( data.Body.values );

      return data;
      }

      $scope.data = processSculptureData( UserDataFactory.getDataForSculpture() );
      //$scope.data = utils.format.Activity( UserDataFactory.getUserActivity(),
      //  utils.target.SCULPTURE );
      //$scope.keys = Object.keys( $scope.data );
      //function () {
      //for()

      //}


      $scope.selected = {
        indices: [],
        data: []
      };

      function updateSculpture () {
        $scope.uiGeoParams[ "radialSegments" ] = $scope.selected.data.length !== 1 ? $scope.selected.data.length - 1 : $scope.selected.data.length;
        $scope.uiGeoParams[ "heightSegments" ] = $scope.selected.data[ 0 ] !== undefined ? $scope.selected.data[ 0 ].length - 1 : 0;
        $scope.uiGeoParams[ 'keys' ] = $scope.selected.indices;

        if ( $scope.uiGeoParams.heightSegments !== 0 )ModelService.updateMesh( $scope.uiGeoParams,
          $scope.uiMatParams );
        else ModelService.removeMesh();

      }

      $scope.toggle = function ( category, item, list, index ) {

        for ( var r = 0; r < list.length; r++ ) {
          if ( list[ r ][ 0 ] === undefined )list.splice( r, 1 );
        }
        var idx = index.indexOf( item );
        if ( idx !== -1 ) {
          index.splice( idx, 1 );
          list.splice( idx, 1 );
          updateSculpture();
        } else {
          index.push( item );
          list.push( $scope.data[category].values[ item ] );
          list.push( [] );
          updateSculpture();
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
        outerRadius: 30,
        innerRadius: 40,
        height: 150,
        interpolate: false,
        definition: 50,
        showLables: false
      };

      $scope.sliderParams = {
        radialSegments: {
          min: 1,
          max: $scope.selected.data.length - 1
        },
        heightSegments: {
          min: 1,
          max: $scope.data['Activity' ].values['steps'].length - 1
        },
        shininess: {
          min: 3,
          max: 15
        },
        linewidth: {
          min: 1,
          max: 5
        },
        definition: {
          step: 1,
          min: 20,
          max: 60
        }
      };


      $scope.onUiParamsChange = function () {
        ModelService.updateMesh( $scope.uiGeoParams, $scope.uiMatParams );
      }
    }
  ]
)
;
