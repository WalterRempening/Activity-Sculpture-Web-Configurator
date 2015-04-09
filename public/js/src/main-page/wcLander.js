(function() {
  'use strict';
  var lander = angular.module('wcLander', []);
  lander.controller('MenuController', function() {
    this.nav = {
      main: [{
        name: 'Get Started',
        state: 'tutorial'
      }, {
        name: 'About',
        state: 'about'
      }]
    }
  });

  lander.controller('OauthController', ['$window', function($window) {
    this.startFlow = function() {
      $window.location.href = "http://localhost:3000/connect/withings";
    };
  }]);

})();


