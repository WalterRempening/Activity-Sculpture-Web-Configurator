'use sctrict';
angular.module('wcDashboard', [])
  .controller('DashboardController',
  ['$http', '$location', '$scope', 'SocketFactory', '$mdDialog', 'GraphFactory',
   function($http, $location, $scope, SocketFactory, $mdDialog, GraphFactory) {
     $scope.user = $location.url().split('/')[2];
     $scope.progress = 0;
     $scope.graph = {};
     $scope.intenistyConfig = GraphFactory.intensityConfig;
     $scope.stepsConfig = GraphFactory.stepsConfig;
     $scope.elevationConfig = GraphFactory.elevationConfig;
     $scope.sleepConfig = GraphFactory.sleepConfig;
     $scope.wakeupConfig = GraphFactory.wakeupConfig;
     $scope.showProgress = function() {
       if ($scope.progress === 4) {
         return true;
       } else {
         return false;
       }
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


     //Recieve user data through sockets =============================
     SocketFactory.on('recieve:user:activity', function(responseData) {
       var data = GraphFactory.formatActivity(responseData);
       $scope.graph.intensity = data.intensity;
       $scope.graph.elevation = data.elevation;
       $scope.graph.steps = data.steps;
       $scope.progress++;
     });

     SocketFactory.on('recieve:user:sleep', function(responseData) {
       var data = GraphFactory.formatSleepData(responseData);
       $scope.graph.wakeup = data.wakeup;
       $scope.graph.sleepDepth = data.depth;
       $scope.progress++;
     });

     SocketFactory.on('recieve:user:body', function(responseData) {
       $scope.body = responseData;
       //console.log('recieve user body' + responseData);
       $scope.progress++;
     });

     SocketFactory.on('recieve:user:profile', function(responseData) {
       $scope.profile = responseData;
       //console.log('recieve user' + responseData);
       $scope.progress++;
     });

   }]);
