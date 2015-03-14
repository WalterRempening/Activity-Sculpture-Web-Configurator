(function () {
    angular.module('siteMngr', [])
        .controller('SiteController', function () {
            var copyYear = Date.now();

            this.year = new Date(copyYear).getFullYear();
        });
});


