'use sctrict';
angular.module('wcDashboard', [])
  .controller('DashboardController',
  ['$http', '$location', '$scope', '$mdDialog', '$mdToast', 'SocketFactory', 'GraphFactory',
   function($http, $location, $scope, $mdDialog, $mdToast, SocketFactory,
            GraphFactory) {
     var ALL_MESSAGES_RECEIVED = 4;

     $scope.user = $location.url().split('/')[2];
     $scope.progress = 0;
     $scope.graph = {};
     $scope.intenistyConfig = GraphFactory.intensityConfig;
     $scope.stepsConfig = GraphFactory.stepsConfig;
     $scope.elevationConfig = GraphFactory.elevationConfig;
     $scope.sleepConfig = GraphFactory.sleepConfig;
     $scope.wakeupConfig = GraphFactory.wakeupConfig;
     $scope.showProgress = function() {
       if ($scope.progress === ALL_MESSAGES_RECEIVED) {
         return true;
       } else {
         return false;
       }
     };

     $scope.showWelcomeToast = function() {
       $mdToast.show({
         controller: 'ToastCtrl',
         templateUrl: '../../../views/dashboard/welcome-toast.html',
         hideDelay: 7000,
         position: 'top left'
       });
     };

     function errorDialog() {
       $mdDialog.show(
         $mdDialog.alert()
           .title('Server Error')
           .content('An error was found while fetching data for your user. Try again later')
           .ariaLabel('Server Error Dialog')
           .ok('OK')
       );
     }

     // Update user data ======================================
     $http.get("/api/user/" + $scope.user + "/data/activity")
       .success(function(data, status, headers, config) {
         SocketFactory.emit('get:user:activity', $scope.user);
       })
       .error(function(data, status, headers, config) {
         // Display error dialog
         if (status === 500) errorDialog();
       });

     $http.get("/api/user/" + $scope.user + "/data/sleep")
       .success(function(data, status, headers, config) {
         SocketFactory.emit('get:user:sleep', $scope.user);
       })
       .error(function(data, status, headers, config) {
         if (status === 500) errorDialog();
       });

     $http.get("/api/user/" + $scope.user + "/data/body")
       .success(function(data, status, headers, config) {
         SocketFactory.emit('get:user:body', $scope.user);
       })
       .error(function(data, status, headers, config) {
         if (status === 500) errorDialog();
       });

     $http.get("/api/user/" + $scope.user + "/data/profile")
       .success(function(data, status, headers, config) {
         SocketFactory.emit('get:user:profile', $scope.user);
       })
       .error(function(data, status, headers, config) {
         if (status === 500) errorDialog();
       });


     //receive user data through sockets =============================
     SocketFactory.on('receive:user:activity', function(responseData) {
       var data = GraphFactory.formatActivity(responseData);
       $scope.graph.intensity = data.intensity;
       $scope.graph.elevation = data.elevation;
       $scope.graph.steps = data.steps;
       $scope.progress++;
     });

     SocketFactory.on('receive:user:sleep', function(responseData) {
       var data = GraphFactory.formatSleepData(responseData);
       $scope.graph.wakeup = data.wakeup;
       $scope.graph.sleepDepth = data.depth;
       $scope.progress++;
     });

     SocketFactory.on('receive:user:body', function(responseData) {
       $scope.body = responseData;
       //console.log('receive user body' + responseData);
       $scope.progress++;
     });

     SocketFactory.on('receive:user:profile', function(responseData) {
       $scope.profile = responseData;
       //console.log('receive user' + responseData);
       $scope.progress++;
     });

   }])
  .controller('ToastCtrl', function($scope, $mdToast) {
    $scope.closeToast = function() {
      $mdToast.hide();
    };
  });