(function () {
  'use strict';
  var controlls = angular.module( 'wcControlls', [] );

  controlls.controller( 'LeftController',
    [ '$mdSidenav', 'ModelService', 'UserDataFactory', 'DataUpdaterService', 'wcEvents',
      function ( $mdSidenav,
                 ModelService,
                 UserDataFactory,
                 DataUpdaterService,
                 wcEvents ) {
        var utils = {
          format: wcDataUtils.format,
          target: wcDataUtils.target
        };

        this.data = utils.format.Activity( UserDataFactory.getUserActivity(),
          utils.target.SCULPTURE );
        DataUpdaterService.listenForUserData( wcEvents.ACTIVITY,
          function ( data ) {
            this.data = utils.format.Activity( data, utils.target.SCULPTURE );
          } );


        this.toggleLeft = function () {
          $mdSidenav( 'left' ).toggle();
        };

        this.uiMatParams = {
          color: 0xfffe00,
          wireframe: false
        };

        this.uiGeoParams = {
          data: this.data,
          outerRadius: 30,
          innerRadius: 40,
          height: 100,
          radialSegments: 30,
          heightSegments: 46
        };

        ModelService.addModel( this.uiGeoParams, this.uiMatParams );

        this.onUiGeoParamsChange = function ( key ) {
          //ModelService.geoParams[ key ] = this.uiGeoParams[ key ];
          ModelService.updateMesh( this.uiGeoParams, this.uiMatParams );
        }

        this.onUiMatParamsChange = function ( key ) {
          //ModelService.matParams[ key ] = this.uiMatParams[ key ];
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
  )
  ;
})();