angular.module('app', ['ui.router', 'ui.bootstrap'])
    .controller('IndexController', function () {
        var copyYear = Date.now();

        this.year = new Date(copyYear).getFullYear();

    });