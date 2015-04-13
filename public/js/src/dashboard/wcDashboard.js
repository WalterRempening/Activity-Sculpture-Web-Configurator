'use sctrict';
angular.module('wcDashboard', [])
  .controller('DashboardController',
  ['$http', '$location', '$scope', 'SocketFactory', '$mdDialog',
   function($http, $location, $scope, SocketFactory, $mdDialog) {
     $scope.user = $location.url().split('/')[2];
     $scope.progress = 0;
     $scope.showProgress = function() {
       if ($scope.progress === 4) {
         return true;
       } else {
         return false;
       }
     };

     $scope.xAxisTickFormatFunction = function() {
       return function(d) {
         return d3.time.format('%e/%m')(new Date(d)); //uncomment for date format
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

     // Order data for graph like this;
     // [{"key": "Series 1",
     //   "values" : [[date1, val], [date2, val]]}]
     function prepareGraphData(resData) {
       var graphData = [];
       var keys = Object.keys(resData[0]);
       keys.splice(0, 1); // delete timezone key
       keys.pop(); // delete Date key

       for (var j = 0; j < keys.length; j++) {
         graphData.push({
           "key": keys[j],
           "values": []
         });
         for (var i = 0; i < resData.length; i++) {
           graphData[j].values.push([
             new Date(resData[i].date), resData[i][keys[j]]
           ]);
         }
       }

       return {
         intensity: [
           graphData[0],
           graphData[1],
           graphData[2],
           graphData[4]
         ],
         elevation: [
           graphData[3]
         ],
         steps: [
           graphData[5],
           graphData[6]
         ]
       };
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
       //console.log('recieve user activity' + responseData);
       $scope.progress++;
       var data = prepareGraphData(responseData);
       $scope.intensity = data.intensity;
       $scope.elevation = data.elevation;
       $scope.steps = data.steps;
     });

     SocketFactory.on('recieve:user:sleep', function(responseData) {
       //console.log('recieve user sleep' + responseData);
       $scope.progress++;
       $scope.sleep = responseData;
     });

     SocketFactory.on('recieve:user:body', function(responseData) {
       //console.log('recieve user body' + responseData);
       $scope.progress++;
       $scope.body = responseData;
     });

     SocketFactory.on('recieve:user:profile', function(responseData) {
       //console.log('recieve user' + responseData);
       $scope.progress++;
       $scope.profile = responseData;
     });

   }]);
