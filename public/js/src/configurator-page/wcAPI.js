(function () {
    'use strict';
    var wcApi = angular.module('wcApi',['wcSocket']);

    wcApi.controller('ApiDataController', ['SocketFactory',function (SocketFactory){

        SocketFactory.on('gotYou', function (msg) {
            console.log(msg);
        });

        this.test = 'Hello';

        this.sayHi = function(){
            SocketFactory.emit('gotYou2', 'What up beach');
        };

    }]);

})();