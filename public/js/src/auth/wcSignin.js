(function() {
  var signin = angular.module('wcSignin', []);

  signin.controller('SigninController', ['$http','$window', function($http, $window) {

    this.name = '';
    this.password = '';

    this.validate = function() {
      var data = {
        name : this.name,
        password : this.password
      }

      $http.post('/api/login', data)
        .success(function(data) {

        })
        .error(function(data) {

        });

    };

    this.startFlow = function() {
      // Redirect to withings flow call
      $window.location.href = "http://localhost:3000/connect/withings";
    };
  }]);
})();