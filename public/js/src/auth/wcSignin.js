(function() {
  var signin = angular.module('wcSignin', []);

  signin.controller('SigninController', ['$http','$window', function($http, $window) {

    this.name = '';
    this.password = '';
    this.validate = function() {
      $http.get('api/login')
        .success(function(resData) {
          console.log(resData);


        })
        .error(function(error) {
          console.log(error);
        });

    };

    this.startFlow = function() {
      // Redirect to withings flow call
      $window.location.href = "http://localhost:3000/connect/withings";

    };
  }]);
})();