/**
 * Controller for the configurator view
 */

(function ( angular ) {
  "use strict";
  var controlls = angular.module( 'wcControlls', [] );

  controlls.controller( 'PanelController',
    [ '$mdSidenav', 'ModelService', 'UserDataFactory', 'DataUpdaterService', 'wcEvents', '$scope', '$stateParams',
      function ( $mdSidenav,
                 ModelService,
                 UserDataFactory,
                 DataUpdaterService,
                 wcEvents,
                 $scope,
                 $stateParams) {
        var utils = {
          format: wcDataUtils.format,
          target: wcDataUtils.target
        };

        /**
         * Process User Data for mapping to the sculpture
         * @param usr
         * @returns {{Activity: {name: string, keys: Array, values: Array}, Sleep: {name: string, keys: Array, values: Array}, Body: {name: string, keys: Array, values: Array}}}
         */
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

          if ( data.Sleep.values[ 'wakeupcount' ].length < data.Activity.values[ 'steps' ].length ) {
            for ( var k = 0; k < data.Sleep.keys.length; k++ ) {
              var diff = data.Activity.values[ 'steps' ].length - data.Sleep.values[ data.Sleep.keys[ k ] ].length;
              for ( var z = 0; z < diff; z++ ) {
                data.Sleep.values[ data.Sleep.keys[ k ] ].push( 0 );
              }
            }
          }

          if ( data.Body.values[ 'SPO2' ].length < data.Activity.values[ 'steps' ].length ) {
            for ( var k = 0; k < data.Body.keys.length; k++ ) {
              var diff = data.Activity.values[ 'steps' ].length - data.Body.values[ data.Body.keys[ k ] ].length;
              for ( var z = 0; z < diff; z++ ) {
                data.Body.values[ data.Body.keys[ k ] ].push( 0 );
              }
            }
          }
          return data;
        }

        // Load processed user data
        $scope.data = processSculptureData( UserDataFactory.getDataForSculpture() );

        // Handle variable selection from the UI
        $scope.selected = {
          indices: [],
          data: []
        };

        function updateSculpture () {
          $scope.uiGeoParams[ "radialSegments" ] = $scope.selected.data.length - 1;

          if ( $scope.uiGeoParams.heightSegments === undefined ) {
            $scope.uiGeoParams[ "heightSegments" ] = $scope.selected.data[ 0 ].length - 1;
          }

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
          } else {
            index.push( item );
            list.push( $scope.data[ category ].values[ item ] );

          }
          list.push( [] );

          $scope.selected.data = list;
          $scope.selected.indices = index;
          $scope.uiGeoParams.data = $scope.selected.data;
          updateSculpture( $scope.uiGeoParams, $scope.uiMatParams );
        };

        $scope.exists = function ( item, index ) {
          if ( index.indexOf( item ) !== -1 ) {
            return true;
          } else {
            return false;
          }
        };

        // Parameter Configuration for UI
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
          showLables: true,
          keys: $scope.selected.indices
        };


        $scope.sliderParams = {
          radialSegments: {
            min: 1,
            max: $scope.selected.data.length - 1
          },
          heightSegments: {
            min: 1,
            max: $scope.data[ 'Activity' ].values[ 'steps' ].length - 1
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

        // Updates sculpture mesh when user makes changes
        $scope.onUiParamsChange = function () {
          ModelService.updateMesh( $scope.uiGeoParams, $scope.uiMatParams );
        };

        // Save sculpture
        $scope.filename = 'MySculpture';
        $scope.settings = UserDataFactory.getUserSettings();

        // Read sculpture params from URL if loaded from the gallery
        if ( $stateParams.sculpture ) {
          var loadeds = JSON.parse( $stateParams.sculpture );
          $scope.selected.indices = loadeds.variables[ 1 ];
          $scope.selected.data = loadeds.variables[ 0 ];
          $scope.uiGeoParams = loadeds.geometry;
          $scope.uiMatParams = loadeds.material;
          $scope.filename = loadeds.name + '-edit';
          ModelService.updateMesh( $scope.uiGeoParams, $scope.uiMatParams );
        }

        $scope.saveSculpture = function ( name ) {
          UserDataFactory.saveUserSculptures( {
            name: name,
            date: new Date( Date.now() ),
            geometry: $scope.uiGeoParams,
            material: $scope.uiMatParams,
            variables: [
              $scope.selected.data,
              $scope.selected.indices
            ]
          } );
        };

        // Wirte mesh to STL file
        $scope.exportSTL = function ( name ) {
          ModelService.saveToSTL( name );
        };

      }
    ]
  );
})( angular );

