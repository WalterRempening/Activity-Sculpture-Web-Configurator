(function () {
    'use strict';
    angular.module('wcMenu', [])
        .controller('MenuController', function () {
            this.nav = {
                main : [
                    {
                        name:'Get Started',
                        state: 'tutorial'
                    },
                    {
                        name: 'About',
                        state: 'about'
                    }],
                configurator : [
                    {
                        name: 'Help',
                        state: 'help'
                    }]
            }

        });
})();


