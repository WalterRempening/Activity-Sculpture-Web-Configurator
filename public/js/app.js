var app = angular.module('app', ['ui.router', 'ui.bootstrap']);

app.controller('SiteController', function () {
    var copyYear = Date.now();

    this.year = new Date(copyYear).getFullYear();

});

app.config(function ($stateProvider,
                     $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '../views/core/landing-page.html',
            controller: 'SiteController'

        })
        .state('about', {
            url:'/about',
            templateUrl: '../views/about-partial.html'
        })
        .state('configurator', {
            url:'/config',
            templateUrl: '../views/configurator-page.html'
        })
        .state('error', {
            url: '/404',
            templateUrl: '../views/core/404.html',
            controller: 'SiteController'
        });

});


