/**
 * Utility Functions for data formatting
 */

(function ( exports ) {
  'use strict';

  exports.format = {
    Activity: formatActivityData,
    Sleep: formatSleepData,
    Body: formatBodyData
  };
  var GRAPH = 42, SCULPTURE = 43;
  exports.target = {
    "GRAPH": GRAPH,
    "SCULPTURE": SCULPTURE
  };

  //Restructure activity, sleep, body data for graphs & models
  function formatActivityData ( resData, target ) {
    var graphData = [];
    var keys = Object.keys( resData[ 0 ] );
    keys.splice( 0, 1 ); // delete timezone key
    keys.pop(); // delete Date key

    for ( var j = 0; j < keys.length; j++ ) {
      graphData.push( {
        "key": keys[ j ],
        "values": []
      } );
      for ( var i = 0; i < resData.length; i++ ) {
        if ( target === GRAPH ) {
          graphData[ j ].values.push( [
            new Date( resData[ i ].date ), resData[ i ][ keys[ j ] ]
          ] );
        } else if ( target === SCULPTURE ) {
          graphData[ j ].values.push( resData[ i ][ keys[ j ] ] );
        }
      }
    }

    var data;
    if ( target === GRAPH ) {
      data = {
        intensity: [
          graphData[ 0 ],
          graphData[ 1 ],
          graphData[ 2 ],
          graphData[ 4 ]
        ],
        elevation: [
          graphData[ 3 ]
        ],
        steps: [
          graphData[ 5 ],
          graphData[ 6 ]
        ]
      };
    } else if ( target === SCULPTURE ) {
      var values = [];
      for ( var k = 0; k < graphData.length; k++ ) {
        values[ keys[ k ] ] = normalizeArray( graphData[ k ].values, 50 );
      }
      data = values;

    }
    return data;
  }

  function formatSleepData ( resData, target ) {
    var graphData = [];
    var keys = Object.keys( resData[ 0 ].data );
    for ( var j = 0; j < keys.length; j++ ) {
      graphData.push( {
        "key": keys[ j ],
        "values": []
      } );
      for ( var i = 0; i < resData.length; i++ ) {

        if ( target === GRAPH ) {
          graphData[ j ].values.push( [
            new Date( resData[ i ].date ), resData[ i ].data[ keys[ j ] ]
          ] );
        } else if ( target === SCULPTURE ) {
          graphData[ j ].values.push( resData[ i ].data[ keys[ j ] ] );
        }
      }
    }

    var data;
    if ( target === GRAPH ) {
      data = {
        depth: [
          graphData[ 0 ],
          graphData[ 2 ],
          graphData[ 3 ],
          graphData[ 4 ]
        ],
        wakeup: [
          graphData[ 1 ],
        ]
      };
    } else if ( target === SCULPTURE ) {
      var values = [];
      for ( var b = 0; b < graphData.length; b++ ) {
        values[ keys[ b ] ] = normalizeArray( graphData[ b ].values, 50 );
      }
      data = values;
    }
    return data;
  }


  function formatBodyData ( resData, target ) {
    var graphData = {};
    var mesType = {
      1: 'Weight',
      4: 'Height',
      11: 'Heart Pulse',
      54: 'SPO2'
    };

    var shapes = [ 'diamond', 'circle', 'square' ];

    for ( var label in mesType ) {
      graphData[ mesType[ label ] ] = {
        "key": mesType[ label ],
        "values": []
      };
    }

    for ( var i = 0; i < resData.length; i++ ) {
      for ( var j = 0; j < resData[ i ].measures.length; j++ ) {
        var cat = mesType[ resData[ i ].measures[ j ].type ];
        if ( target === GRAPH ) {
          graphData[ cat ].values.push( {
            x: new Date( resData[ i ].date ),
            y: resData[ i ].measures[ j ].value,
            size: j,
            shape: shapes[ j ]
          } );
        } else if ( target === SCULPTURE ) {
          graphData[ cat ].values.push( resData[ i ].measures[ j ].value );
        }

      }
    }

    var data;
    if ( target === GRAPH ) {
      data = {
        weight: [ graphData[ 'Weight' ] ],
        height: [ graphData[ 'Height' ] ],
        heartpulse: [
          graphData[ 'Heart Pulse' ],
          graphData[ 'SPO2' ]
        ]
      };
    } else if ( target === SCULPTURE ) {
      var values = [];
      values[ 'Heart Pulse' ] = normalizeArray( graphData[ 'Heart Pulse' ].values,
        50 );
      values[ 'SPO2' ] = normalizeArray( graphData[ 'SPO2' ].values, 50 );
      data = values;
    }

    return data;
  }

  function normalizeArray ( data, max ) {
    var normalized = [];
    var ratio = Math.max.apply( Math, data ) / max;

    for ( var i = 0; i < data.length; i++ ) {
      normalized.push( Math.round( data[ i ] / ratio ) );
    }

    return normalized;
  }

  //return exports
})( typeof exports === 'undefined' ? this[ 'wcDataUtils' ] = {} : exports );