(function () {
    var footer = angular.module('wcFooter', []);
    footer.controller('FooterController', function () {
        this.year = new Date(Date.now()).getFullYear();
    });

    footer.directive('dwcFooter', function(){
       return {
           restrict: 'E',
           replace: 'true',
           templateUrl: '../../../views/core/footer-partial.html',
           controller: 'FooterController',
           controllerAs: 'ftrCtrl'
       };
    });

})();