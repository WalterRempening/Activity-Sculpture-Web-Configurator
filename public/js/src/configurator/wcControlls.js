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
      DataUpdaterService.listenForUserData( wcEvents.ACTIVITY,
        function ( data ) {
          $scope.data = utils.format.Activity( data, utils.target.SCULPTURE );
        } );

      this.toggleLeft = function () {
        $mdSidenav( 'left' ).toggle();
      };

      console.log( $mdSidenav( 'left' ).isOpen() );
      this.color;

      this.uiMatParams = {
        color: '#fffe00',
        shininess: 3,
        wireframe: false,
        linewidth: 1
      };


      this.uiGeoParams = {
        data: $scope.data,
        outerRadius: 30,
        innerRadius: 40,
        height: 100,
        radialSegments: $scope.data.length - 1,
        heightSegments: $scope.data[ 0 ].length - 1,
        definition: (($scope.data.length - 1 ) * 10),
        interpolate: false
      };

      this.sliderParams = {
        radialSegments: {
          min: 1,
          max: $scope.data.length - 1
        },
        heightSegments: {
          min: 1,
          max: $scope.data[ 0 ].length - 1
        },
        definition: {
          step: this.uiGeoParams.radialSegments,
          min: this.uiGeoParams.radialSegments,
          max: this.uiGeoParams.definition
        },
        shininess: {
          min: 0,
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

      //this.onUiMatParamsChange = function () {
      //  ModelService.updateMesh( this.uiGeoParams, this.uiMatParams );
      //}


      this.toggle = {
        rotate: false
      }

      this.onRotateToggle = function () {
        ModelService.rotate = this.toggle.rotate;
      };

    }
  ]
);

controlls.controller( 'RightController', [ '$mdSidenav', function ( $mdSidenav ) {
  console.log($mdSidenav('right').isOpen());

  this.color;
} ] );