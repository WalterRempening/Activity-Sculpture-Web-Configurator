(function () {
    var app = angular.module('app', ['ui.router',
                                     'ui.bootstrap',
                                     'ngAnimate',
                                     'wcMenuScroller',
                                     'wcFooter']);

    app.config(['$stateProvider',
                '$urlRouterProvider',
                function ($stateProvider,
                         $urlRouterProvider) {

        $urlRouterProvider.otherwise(function($injector, $location){
            var state = $injector.get('$state');
            state.go('404');
            return $location.path();
        });

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '../views/core/landing-page.html'
            })
            .state('about', {
                url: '/about',
                templateUrl: '../views/core/about-partial.html'
            })
            .state('configurator', {
                url: '/config',
                templateUrl: '../views/configurator/configurator-page.html'
            })
            .state('404', {
                templateUrl: '../views/core/404.html'
            });

    }]);

})();


