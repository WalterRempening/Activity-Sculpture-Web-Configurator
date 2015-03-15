(function () {
    angular.module('wcMenuScroller', [])
        .controller('MenuController', function () {
            this.nav = {
                main : [
                    {
                        name: 'About',
                        state: 'about'
                    },
                    {
                        name:'Tutorial',
                        state: 'tutorial'
                    }],
                configurator : [
                    {
                        name: 'Help',
                        state: 'help'
                    }]
            }

        });
})();


