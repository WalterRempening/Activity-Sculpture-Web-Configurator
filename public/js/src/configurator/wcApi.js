(function() {
  'use strict';
  var wcApi = angular.module('wcApi', []);


  wcApi.service('ApiService', ['SocketFactory', function(SocketFactory) {


    function getUserData() {
      SocketFactory.emit('getUserData');

      SocketFactory.on('recieveData', function(responseData) {
        return responseData;
      })
    };

    this.getData = function() {
      return 0;
    }

    return {
      getUserData: getUserData()
    };

  }]);
})();