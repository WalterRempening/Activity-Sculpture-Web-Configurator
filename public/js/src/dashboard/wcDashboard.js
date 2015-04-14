'use sctrict';
angular.module('wcDashboard', [])
  .controller('DashboardController',
  ['$http', '$location', '$scope', 'SocketFactory', '$mdDialog',
   function($http, $location, $scope, SocketFactory, $mdDialog) {
     $scope.user = $location.url().split('/')[2];
     $scope.progress = 0;
     function refreshCharts() {
       setTimeout(function() {
         $scope.chart1.refresh();
         $scope.chart2.refresh();
         $scope.chart3.refresh();
         $scope.chart4.refresh();
         $scope.chart5.refresh();
       }, 600);
     }

     $scope.graph = {};
     $scope.options = {
       chart: {
         type: 'multiBarChart',
         height: 450,
         margin: {
           top: 20,
           right: 20,
           bottom: 60
         },
         x: function(d) {
           return d[0];
         },
         y: function(d) {
           return d[1];
         },
         useVoronoi: false,
         clipEdge: true,
         transitionDuration: 500,
         useInteractiveGuideline: true,
         xAxis: {
           showMaxMin: false,
           tickFormat: function(d) {
             return d3.time.format('%e/%m/%y')(new Date(d))
           }
         },
         yAxis: {
           "axisLabel": "Duration (s)"
         }
       }
     };

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

     function prepareActivityGraphData(resData) {
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

     function prepareSleepGraphData(resData) {
       var graphData = [];
       var keys = Object.keys(resData[0].data);
       console.log(keys);
       for (var j = 0; j < keys.length; j++) {
         graphData.push({
           "key": keys[j],
           "values": []
         });
         for (var i = 0; i < resData.length; i++) {
           graphData[j].values.push([
             new Date(resData[i].date), resData[i].data[keys[j]]
           ]);
         }
       }
       return {
         depth: [
           graphData[0],
           graphData[2],
           graphData[3],
           graphData[4]
         ],
         wakeup: [
           graphData[1],
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
       var data = prepareActivityGraphData(responseData);
       $scope.graph.intensity = data.intensity;
       $scope.graph.elevation = data.elevation;
       $scope.graph.steps = data.steps;
       $scope.progress++;
       //refreshCharts();
     });

     SocketFactory.on('recieve:user:sleep', function(responseData) {
       var data = prepareSleepGraphData(responseData);
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
