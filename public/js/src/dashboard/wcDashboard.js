'use sctrict';
angular.module( 'wcDashboard', [] )
  .controller( 'DashboardController',
  [ '$scope', '$mdDialog', '$mdToast', 'GraphFactory', 'UserDataFactory', '$cookies', '$state', 'DataUpdaterService', 'wcEvents',
    function ( $scope, $mdDialog, $mdToast, GraphFactory,
               UserDataFactory, $cookies, $state, DataUpdaterService,
               wcEvents ) {

      var settings = JSON.parse( $cookies.settings );
      var utilsFormater = wcDataUtils.format;
      var utilsTarget = wcDataUtils.target;
      if ( settings.show ) {
        UserDataFactory.init();
      }

      //Graph Configuration Loading ==================================================
      $scope.graph = {};
      $scope.intensityConfig = GraphFactory.intensityConfig;
      $scope.stepsConfig = GraphFactory.stepsConfig;
      $scope.elevationConfig = GraphFactory.elevationConfig;
      $scope.sleepConfig = GraphFactory.sleepConfig;
      $scope.wakeupConfig = GraphFactory.wakeupConfig;
      $scope.bodyConfig = GraphFactory.bodyConfig;

      //Form data ====================================================================
      $scope.startDate;
      $scope.endDate = new Date( Date.now() ).toISOString().slice( 0, 10 );

      //Sculpture archive ============================================================
      DataUpdaterService.listenForUserData( wcEvents.SCULPTURES,
        function ( data ) {
          $scope.sculptures = data;
        } );

      var id = UserDataFactory.getUserId();
      $scope.toConfigurator = function () {
        $state.go( 'configurator', { userid: id } );
      }

      $scope.loadSculpture = function ( sculpture ) {
        $state.go( 'configurator', { userid: id, sculpture: JSON.stringify(sculpture) } );
      };

      //User Data Assignment =========================================================
      var ALL_MESSAGES_RECEIVED = 4;
      $scope.showProgress = function () {
        if ( $scope.progress === ALL_MESSAGES_RECEIVED ) {
          return true;
        } else {
          return false;
        }
      };

      DataUpdaterService.listenForUserData( wcEvents.PROFILE,
        function ( data ) {
          $scope.profile = data;
        } );

      DataUpdaterService.listenForUserData( wcEvents.ACTIVITY,
        function ( data ) {
          $scope.graph.activity = utilsFormater.Activity( data,
            utilsTarget.GRAPH );
        } );

      DataUpdaterService.listenForUserData( wcEvents.BODY,
        function ( data ) {
          $scope.graph.body = utilsFormater.Body( data, utilsTarget.GRAPH );
        } );

      DataUpdaterService.listenForUserData( wcEvents.SLEEP,
        function ( data ) {
          $scope.graph.sleep = utilsFormater.Sleep( data, utilsTarget.GRAPH );
        } );

      $scope.progress = UserDataFactory.getProgress();
      DataUpdaterService.listenForUserData( wcEvents.PROGRESS,
        function ( data ) {
          $scope.progress = data;
        } );

      //Help Toast ====================================================================
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


