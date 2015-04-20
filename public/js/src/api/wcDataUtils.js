(function ( exports ) {
  'use strict';
  exports.format = {
    Activity: formatActivityData,
    Sleep: formatSleepData,
    Body: formatBodyData
  };

  exports.normalize = {
    Val: normalizeVal,
    Array: normalizeArray
  }

  //Reorganize activty, sleep, body data for graphs/models =============================
  function formatActivityData ( resData ) {
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
        graphData[ j ].values.push( [
          new Date( resData[ i ].date ), resData[ i ][ keys[ j ] ]
        ] );
      }
    }
    return {
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
  }

  function formatSleepData ( resData ) {
    var graphData = [];
    var keys = Object.keys( resData[ 0 ].data );
    for ( var j = 0; j < keys.length; j++ ) {
      graphData.push( {
        "key": keys[ j ],
        "values": []
      } );
      for ( var i = 0; i < resData.length; i++ ) {
        graphData[ j ].values.push( [
          new Date( resData[ i ].date ), resData[ i ].data[ keys[ j ] ]
        ] );
      }
    }
    return {
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
  }

  function formatBodyData ( resData ) {
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
        graphData[ cat ].values.push( {
          x: new Date( resData[ i ].date ),
          y: resData[ i ].measures[ j ].value,
          size: j,
          shape: shapes[ j ]
        } );
      }
    }

    return {
      weight: [ graphData[ 'Weight' ] ],
      height: [ graphData[ 'Height' ] ],
      heartpulse: [
        graphData[ 'Heart Pulse' ],
        graphData[ 'SPO2' ]
      ]
    };
  }

  function normalizeVal ( data, min, max ) {
    var normalized = (data - min) / (max - min);
    return normalized;
  }

  function normalizeArray ( data, min, max ) {
    var normalized = [];

    for ( var i = 0; i < data.length; i++ ) {
      normalized.push( (data[ i ][ 1 ] - min) / (max - min) );
    }

    return normalized;
  }

  //return exports;
})( typeof exports === 'undefined' ? this[ 'wcDataUtils' ] = {} : exports );