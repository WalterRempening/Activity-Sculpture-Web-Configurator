(function() {
  'use sctrict';
  
  var dashboard = angular.module('wcDashboard', []);
  dashboard.controller('DashboardController',
    ['$http', '$location', '$scope', 'SocketFactory',
     function($http, $location, $scope, SocketFactory) {
      
       $scope.user = $location.url().split('/')[2];
       $http.get("/api/user/" + $scope.user + "/data/activity")
         .success(function(data, status, headers, config) {
           SocketFactory.emit('get:user:activity', $scope.user);
         })
         .error(function(data, status, headers, config) {
         });

       $http.get("/api/user/" + $scope.user + "/data/sleep")
         .success(function(data, status, headers, config) {
           SocketFactory.emit('get:user:sleep', $scope.user);
         })
         .error(function(data, status, headers, config) {

         });

       $http.get("/api/user/" + $scope.user + "/data/body")
         .success(function(data, status, headers, config) {
           SocketFactory.emit('get:user:body', $scope.user);
         })
         .error(function(data, status, headers, config) {

         });

       SocketFactory.on('recieve:user:activity', function(responseData) {
         console.log('recieve user activity' + responseData);
         $scope.activity = responseData;
       });

       SocketFactory.on('recieve:user:sleep', function(responseData) {
         console.log('recieve user sleep' + responseData);
         $scope.sleep = responseData;
       });

       SocketFactory.on('recieve:user:body', function(responseData) {
         console.log('recieve user body' + responseData);
         $scope.body = responseData;
       });

     }]);
})();