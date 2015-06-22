/**
 * Socket IO into an Angular factory
 * for more info:
 * http://www.interaktionsdesigner.de/2013/die-killerapplikation-mit-node.js-socket.io-und-angularjs/
 */

(function () {
  'use sctrict';
  var wcio = angular.module( 'wcSocket', [] );

  wcio.factory( 'SocketFactory', [ '$rootScope', function ( $rootScope ) {
    var socket = io();

    function on ( event, callback ) {
      socket.on( event, function () {
        var args = arguments;
        $rootScope.$apply( function () {
          callback.apply( null, args );
        } );
      } );
    }

    function off ( event, callback ) {
      socket.removeListener( event, callback );
    }

    function emit ( event, data, callback ) {
      socket.emit( event, data, function () {
        var args = arguments;
        $rootScope.$apply( function () {
          if ( callback ) {
            callback.apply( null, args );
          }
        } );
      } );
    }

    return {
      on: on,
      off: off,
      emit: emit
    };
  } ] );
})();