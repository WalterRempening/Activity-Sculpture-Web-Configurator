(function () {
    'use sctrict';
    var wcio = angular.module('wcSocket', []);

    wcio.factory('SocketFactory',['$rootScope', function ($rootScope) {
        var socket = io();
        return {
            on: function (event, callback) {
                socket.on(event, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(null, args);
                    });
                });

            },
            off: function (event, callback) {
                socket.removeListener(event, callback);
            },
            emit: function(event, data, callback) {
                socket.emit(event, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function (){
                        if(callback){
                            callback.apply(null, args);
                        }
                    });
                });
            }
        };

    }]);
})();