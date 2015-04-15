'use sctrict';
angular.module('wcDashboard', [])
  .controller('DashboardController',
  ['$scope', '$mdDialog', '$mdToast', 'GraphFactory', 'UserDataFactory',
   function($scope, $mdDialog, $mdToast, GraphFactory,
            UserDataFactory) {

     UserDataFactory.init();

     //Graph Configuration Loading ==========================================================
     $scope.graph = {};
     $scope.intenistyConfig = GraphFactory.intensityConfig;
     $scope.stepsConfig = GraphFactory.stepsConfig;
     $scope.elevationConfig = GraphFactory.elevationConfig;
     $scope.sleepConfig = GraphFactory.sleepConfig;
     $scope.wakeupConfig = GraphFactory.wakeupConfig;
     $scope.progress = 0;

     //User Data Assignment =================================================================
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

     //Setup Form Dialog =============================================================
     $scope.showForm = function(ev) {
       $mdDialog.show({
         controller: SetupController,
         templateUrl: '../../../views/dashboard/setup-form.tmpl.html',
         targetEvent: ev
       })
         .then(function(answer) {
           $scope.alert = 'You said the information was "' + answer + '".';
         }, function() {
           $scope.alert = 'You cancelled the dialog.';
         });
     };

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
  }])

  .controller('SetupController',
  ['$scope', '$mdDialog', function($scope, $mdDialog) {
    $scope.startDate;
    $scope.endDate = new Date(Date.now()).toISOString().slice(0, 10);
    $scope.hide = function() {$mdDialog.hide();};
    $scope.cancel = function() {$mdDialog.cancel();};
  }]);


