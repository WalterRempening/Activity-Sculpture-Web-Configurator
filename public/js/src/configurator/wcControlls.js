(function () {
  'use strict';
  var controlls = angular.module('wcControlls', []);

  controlls.controller('LeftController',
    ['$timeout', '$mdSidenav', 'ModelService','$log', function ($timeout, $mdSidenav, ModelService, $log) {
      this.toggleLeft = function () {
        $mdSidenav('left').toggle();
      };

      this.sliderVal = {
        n: 100
      };

      this.switch = {
        n: true
      }

      ModelService.addModel();

    }]
  );
})();