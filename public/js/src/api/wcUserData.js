'use strict';
angular.module( 'wcUserData', [] )
  .factory( 'UserDataFactory',
  [ '$http', 'SocketFactory', '$cookies', '$mdDialog', 'DataUpdaterService', 'wcEvents',
    function ( $http,
               SocketFactory,
               $cookies,
               $mdDialog,
               DataUpdaterService,
               wcEvents ) {

      var sessuser = JSON.parse( $cookies.user );
      var DATA_RESPONSE_ERROR = 'An error was found while fetching data for your user. Try again later';
      var SAVE_SETTINGS_RESPONSE_ERROR = 'User settings could not be saved';
      var progress = 0;

      // initialize user object
      var user = {
        profile: [],
        id: sessuser.id,
        sleep: {
          depth: [],
          wakeup: []
        },
        activity: {
          steps: [],
          elevation: [],
          intensity: []
        },
        body: {
          heartpulse: []
        },
        config: {
          startdate: "",
          enddate: ""
        },
        settings: {},
        sculptures: []
      };

      // setters and getters for module
      function getUser () {return user;}

      function getUserId () {return user.id;}

      function getUserProfile () {return user.profile;}

      function getUserSleep () {return user.sleep;}

      function getUserBody () {return user.body;}

      function getUserActivity () {return user.activity;}

      function getProgress () {return progress};

      function errorDialog ( msg ) {
        $mdDialog.show(
          $mdDialog.alert()
            .title( 'Server Error' )
            .content( msg )
            .ariaLabel( 'Server Error Dialog' )
            .ok( 'OK' )
        );
      }

      function queryUserSettings ( callback ) {
        $http.get( "/api/user/" + user.id + "/settings" )
          .success( function ( data, status, headers, config ) {
            callback( data );
          } )
          .error( function ( data, status, headers, config ) {
            if ( status == 500 ) errorDialog( SAVE_SETTINGS_RESPONSE_ERROR );
          } );
      }

      function saveUserSettings ( settings ) {
        $http.post( "/api/user/" + user.id + "/settings", settings )
          .success( function ( data, status, headers, config ) {
            user.settings = settings;
            console.log( 'User saved successfully' );
          } )
          .error( function ( data, status, headers, config ) {
            if ( status == 500 ) errorDialog( SAVE_SETTINGS_RESPONSE_ERROR );
          } );
      }

      function getUserSettings () {
        return user.settings;
      }

      function getDataForSculpture () {
        return [
          user.activity,
          user.sleep,
          user.body
        ];
      }

      //User Sculpture Management =============================
      function getUserSculptures () {
        SocketFactory.emit( 'get:user:sculptures', user.id );
      }

      function saveUserSculptures ( sculpture ) {
        $http.post( "/api/user/" + user.id + "/sculptures", sculpture )
          .success( function ( data, status, headers, config ) {
            SocketFactory.emit( 'get:user:sculptures', user.id );
          } )
          .error( function ( data, status, headers, config ) {
            // Display error dialog
            if ( status === 500 ) errorDialog( DATA_RESPONSE_ERROR );
          } );
      }

      SocketFactory.on( 'receive:user:sculptures', function ( responseData ) {
        var data = responseData;
        user.sculptures = data;
        //console.log(user.sculptures);
      } );


      function init () {
        // Query User Data to API======================================
        $http.get( "/api/user/" + user.id + "/data/activity" )
          .success( function ( data, status, headers, config ) {
            SocketFactory.emit( 'get:user:activity', user.id );
          } )
          .error( function ( data, status, headers, config ) {
            // Display error dialog
            if ( status === 500 ) errorDialog( DATA_RESPONSE_ERROR );
          } );

        $http.get( "/api/user/" + user.id + "/data/sleep" )
          .success( function ( data, status, headers, config ) {
            SocketFactory.emit( 'get:user:sleep', user.id );
          } )
          .error( function ( data, status, headers, config ) {
            if ( status === 500 ) errorDialog( DATA_RESPONSE_ERROR );
          } );

        $http.get( "/api/user/" + user.id + "/data/body" )
          .success( function ( data, status, headers, config ) {
            SocketFactory.emit( 'get:user:body', user.id );
          } )
          .error( function ( data, status, headers, config ) {
            if ( status === 500 ) errorDialog( DATA_RESPONSE_ERROR );
          } );


        $http.get( "/api/user/" + user.id + "/data/profile" )
          .success( function ( data, status, headers, config ) {
            SocketFactory.emit( 'get:user:profile', user.id );
          } )
          .error( function ( data, status, headers, config ) {
            if ( status === 500 ) errorDialog( DATA_RESPONSE_ERROR );
          } );
      }

      //receive user data through sockets =============================
      SocketFactory.on( 'receive:user:activity', function ( responseData ) {
        //var data = format.Activity( responseData );
        user.activity = responseData;
        DataUpdaterService.broadcastUserData( wcEvents.ACTIVITY,
          user.activity );
        //console.log(user.activity);
        progress++;
        DataUpdaterService.broadcastUserData( wcEvents.PROGRESS, progress );
      } );

      SocketFactory.on( 'receive:user:sleep', function ( responseData ) {
        user.sleep = responseData;
        DataUpdaterService.broadcastUserData( wcEvents.SLEEP,
          user.sleep );
        //console.log(user.sleep);
        progress++;
        DataUpdaterService.broadcastUserData( wcEvents.PROGRESS, progress );
      } );

      SocketFactory.on( 'receive:user:body', function ( responseData ) {
        user.body = responseData;
        DataUpdaterService.broadcastUserData( wcEvents.BODY,
          user.body );
        //console.log('receive user body' + responseData);
        progress++;
        DataUpdaterService.broadcastUserData( wcEvents.PROGRESS, progress );
      } );

      SocketFactory.on( 'receive:user:profile', function ( responseData ) {
        user.profile = responseData;
        DataUpdaterService.broadcastUserData( wcEvents.PROFILE,
          user.profile );
        //console.log(user.profile);
        progress++;
        DataUpdaterService.broadcastUserData( wcEvents.PROGRESS, progress );
      } );


      return {
        init: init,
        getUser: getUser,
        getUserId: getUserId,
        getUserProfile: getUserProfile,
        getUserSleep: getUserSleep,
        getUserActivity: getUserActivity,
        getUserBody: getUserBody,
        queryUserSettings: queryUserSettings,
        getUserSettings: getUserSettings,
        saveUserSettings: saveUserSettings,
        getDataForSculpture: getDataForSculpture,
        getUserSculptures: getUserSculptures,
        saveUserSculptures: saveUserSculptures,
        getProgress: getProgress
      };
    } ] )

  .service( 'DataUpdaterService', [ '$rootScope', function ( $rootScope ) {

    this.broadcastUserData = function ( event, data ) {
      $rootScope.$broadcast( event, data );
    };

    this.listenForUserData = function ( event, callback ) {
      $rootScope.$on( event, function ( event, data ) {
        callback( data );
      } );
    };
  } ] )
  .constant( 'wcEvents', {
    "ACTIVITY": "activity",
    "BODY": "body",
    "SLEEP": "sleep",
    "DATA_FOR_SCULPTURE": "scultpure-data",
    "PROFILE": "profile",
    "SCULPTURES": "sculptures",
    "PROGRESS": "progress"
  } );