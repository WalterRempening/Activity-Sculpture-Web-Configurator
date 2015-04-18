(function() {
  'use strict';
  var lander = angular.module('wcLander', []);

  lander.controller('MenuController', [function() {
    this.nav = {
      main: [{
        name: 'Get Started',
        state: 'tutorial'
      }, {
        name: 'About',
        state: 'about'
      }]
    }
  }]);

  lander.controller('OauthController',
    ['$window', '$cookies', '$state', function($window, $cookies, $state) {
      this.startFlow = function() {
        if (!$cookies.user) {
          $window.location.href = "/auth/withings";
        } else {
          var user = JSON.parse($cookies.user);
          $state.go('settings', {userid: user.id});
        }


      };
    }]);

})();


