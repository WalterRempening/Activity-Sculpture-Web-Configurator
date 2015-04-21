'use sctrict';
angular.module( 'wcDashboard', [] )
  .controller( 'DashboardController',
  [ '$scope', '$mdDialog', '$mdToast', 'GraphFactory', 'UserDataFactory', '$cookies', '$state', 'DataUpdaterService', 'wcEvents',
    function ( $scope, $mdDialog, $mdToast, GraphFactory,
               UserDataFactory, $cookies, $state, DataUpdaterService,
               wcEvents ) {

      var settings = JSON.parse( $cookies.settings );

      if ( settings.show ) {
        UserDataFactory.init();
      }

      //Graph Configuration Loading ===================================================
      $scope.graph = {};
      $scope.intensityConfig = GraphFactory.intensityConfig;
      $scope.stepsConfig = GraphFactory.stepsConfig;
      $scope.elevationConfig = GraphFactory.elevationConfig;
      $scope.sleepConfig = GraphFactory.sleepConfig;
      $scope.wakeupConfig = GraphFactory.wakeupConfig;
      $scope.bodyConfig = GraphFactory.bodyConfig;

      //Form data =====================================================================
      $scope.startDate;
      $scope.endDate = new Date( Date.now() ).toISOString().slice( 0, 10 );

      //Sculpture archive =============================================================
      $scope.sculptures = UserDataFactory.getUser
      DataUpdaterService.listenForUserData( wcEvents.SCULPTURES,
        function ( data ) {
          $scope.sculptures = data;
        } );

      $scope.toConfigurator = function () {
        var id = UserDataFactory.getUserId();
        $state.go( 'configurator', { userid: id } );
      }

      //User Data Assignment ==========================================================
      var ALL_MESSAGES_RECEIVED = 4;
      $scope.showProgress = function () {
        if ( $scope.progress === ALL_MESSAGES_RECEIVED ) {
          return true;
        } else {
          return false;
        }
      };

      $scope.profile = UserDataFactory.getUserProfile();
      DataUpdaterService.listenForUserData( wcEvents.PROFILE,
        function ( data ) {
          $scope.profile = data;
      } );

      $scope.graph.activity = UserDataFactory.getUserActivity();
      DataUpdaterService.listenForUserData( wcEvents.ACTIVITY,
        function ( data ) {
          $scope.graph.activity = data;
        } );

      $scope.graph.body = UserDataFactory.getUserBody();
      DataUpdaterService.listenForUserData( wcEvents.BODY,
        function ( data ) {
          $scope.graph.body = data;
        } );


      $scope.graph.sleep = UserDataFactory.getUserSleep();
      DataUpdaterService.listenForUserData( wcEvents.SLEEP,
        function ( data ) {
          $scope.graph.sleep = data;
        } );

      $scope.progress = UserDataFactory.getProgress();
      DataUpdaterService.listenForUserData( wcEvents.PROGRESS,
        function ( data ) {
          $scope.progress = data;
        } );

      //Help Toast =====================================================================
      $scope.showWelcomeToast = function () {
        $mdToast.show( {
          controller: 'ToastController',
          templateUrl: '../../../views/dashboard/welcome-toast.html',
          hideDelay: 7000,
          position: 'top left'
        } );
      };
    } ] )

  .controller( 'ToastController',
  [ '$scope', '$mdToast', function ( $scope, $mdToast ) {
    $scope.closeToast = function () {
      $mdToast.hide();
    };
  } ] );


