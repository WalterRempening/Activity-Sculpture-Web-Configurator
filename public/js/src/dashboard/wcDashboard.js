'use sctrict';
angular.module('wcDashboard', [])
  .controller('DashboardController',
  ['$scope', '$mdDialog', '$mdToast', 'GraphFactory', 'UserDataFactory','$cookies', '$state',
   function($scope, $mdDialog, $mdToast, GraphFactory,
            UserDataFactory, $cookies, $state) {

     var settings = JSON.parse($cookies.settings);

     if(settings.show){
       UserDataFactory.init();
     }

     //Graph Configuration Loading ===================================================
     $scope.graph = {};
     $scope.intenistyConfig = GraphFactory.intensityConfig;
     $scope.stepsConfig = GraphFactory.stepsConfig;
     $scope.elevationConfig = GraphFactory.elevationConfig;
     $scope.sleepConfig = GraphFactory.sleepConfig;
     $scope.wakeupConfig = GraphFactory.wakeupConfig;
     $scope.bodyConfig = GraphFactory.bodyConfig;

     //Form data =====================================================================
     $scope.startDate;
     $scope.endDate = new Date(Date.now()).toISOString().slice(0, 10);

     //Sculpture archive =============================================================
     $scope.sculptures = UserDataFactory.getUser
     $scope.$watch(function(newVal, oldVal) {
       if (newVal != oldVal) {
         $scope.sculptures = UserDataFactory.getUserSculptures();
       }
     });

     $scope.toConfigurator = function() {
       var id = UserDataFactory.getUserId();
      $state.go('configurator', {userid: id});
     }

     //User Data Assignment ==========================================================
     var ALL_MESSAGES_RECEIVED = 4;
     $scope.showProgress = function() {
       if ($scope.progress === ALL_MESSAGES_RECEIVED) {
         return true;
       } else {
         return false;
       }
     };

     $scope.profile = UserDataFactory.getUserProfile();
     $scope.$watch(function(newVal, oldVal) {
       if (newVal != oldVal) {
         $scope.profile = UserDataFactory.getUserProfile();
       }
     });

     $scope.graph.activity = UserDataFactory.getUserActivity();
     $scope.$watch(function(newVal, oldVal) {
       if (newVal != oldVal) {
         $scope.graph.activity = UserDataFactory.getUserActivity();
       }
     });

     $scope.graph.body = UserDataFactory.getUserBody();
     $scope.$watch(function(newVal, oldVal) {
       if (newVal != oldVal) {
         $scope.graph.body = UserDataFactory.getUserBody();
       }
     });


     $scope.graph.sleep = UserDataFactory.getUserSleep();
     $scope.$watch(function(newVal, oldVal) {
       if (newVal != oldVal) {
         $scope.graph.sleep = UserDataFactory.getUserSleep();
       }
     });

     $scope.progress = UserDataFactory.getProgress();
     $scope.$watch(function(newVal, oldVal) {
       if (newVal != oldVal) {
         $scope.progress = UserDataFactory.getProgress();
       }
     });

     //Help Toast =====================================================================
     $scope.showWelcomeToast = function() {
       $mdToast.show({
         controller: 'ToastController',
         templateUrl: '../../../views/dashboard/welcome-toast.html',
         hideDelay: 7000,
         position: 'top left'
       });
     };
   }])

  .controller('ToastController',
  ['$scope', '$mdToast', function($scope, $mdToast) {
    $scope.closeToast = function() {
      $mdToast.hide();
    };
  }]);


