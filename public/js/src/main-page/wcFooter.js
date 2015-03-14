(function () {
    var footer = angular.module('wcFooter', []);
    footer.controller('FooterController', function () {
        var copyYear = Date.now();
        this.year = new Date(copyYear).getFullYear();
    });

    footer.directive('dwcFooter', function(){
       return {
           restrict: 'E',
           templateUrl: '../../../views/core/footer-partial.html',
           controller: 'FooterController',
           controllerAs: 'ftrCtrl'
       };
    });

})();