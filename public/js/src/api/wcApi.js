(function() {
  'use strict';
  var wcApi = angular.module('wcApi', []);

  wcApi.service('ApiService', ['SocketFactory', function(SocketFactory) {
    this.getUserData = function(userid) {
      SocketFactory.emit('getUserData', userid);
    };

    SocketFactory.on('recieveData', function(responseData) {
      this.data = responseData;
    });
  }]);
})();


//controlls.controller('DataController',
//  ['ApiService', 'SocketFactory', '$location', '$scope',
//   function(ApiService, SocketFactory, $location, $scope) {
//
//     this.user = $location.url().split('/')[2];
//     SocketFactory.emit('getUserData', this.user);
//
//     SocketFactory.on('recieveData', function(data) {
//       this.activity = data;
//     });
//
//   }]);