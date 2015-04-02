(function() {
  'use strict';
  var controlls = angular.module('wcControlls', []);

  controlls.controller('DataController', ['ApiService', function(ApiService) {
    this.hello = "hello dawg!";

    this.token = function() {
     return $window.sessionStorage;
    };
  }])

  controlls.controller('LeftController',
    ['$timeout', '$mdSidenav', 'ModelService', '$log', '$scope',
     function($timeout,
              $mdSidenav,
              ModelService) {

       ModelService.addModel();

       this.toggleLeft = function() {
         $mdSidenav('left').toggle();
       };

       this.scale = {
         x: 1.00,
         y: 1.00,
         z: 1.00
       };

       this.onScaleX = function() {
         ModelService.scale.x = this.scale.x;
       };

       this.onScaleY = function() {
         ModelService.scale.y = this.scale.y;
       };

       this.onScaleZ = function() {
         ModelService.scale.z = this.scale.z;
       };

       this.toggle = {
         rotate: false
       }

       this.onRotateToggle = function() {
         ModelService.rotate = this.toggle.rotate;
       };


     }]
  );
})();