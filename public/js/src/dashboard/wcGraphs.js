/**
 * Graph configuration objects
 * for the nvd3 directives
 * http://krispo.github.io/angular-nvd3/#/
 */

(function ( angular ) {
  'use strict';
  angular.module( 'wcGraphs', [] )
    .factory( 'GraphFactory', [ function () {

      var activityIntensityConfig = {
        chart: {
          type: 'multiBarChart',
          height: 450,
          margin: {
            top: 20,
            bottom: 60,
            left: 75
          },
          x: function ( d ) {
            return d[ 0 ];
          },
          y: function ( d ) {
            return d[ 1 ];
          },
          useVoronoi: false,
          clipEdge: true,
          stacked: true,
          showControls: false,
          transitionDuration: 500,
          useInteractiveGuideline: true,
          xAxis: {
            showMaxMin: false,
            tickFormat: function ( d ) {
              return d3.time.format( '%e/%m/%y' )( new Date( d ) )
            }
          },
          yAxis: {
            "axisLabel": "Duration (s) / Calories (kcal)"
          }
        }
      };

      var stepsConfig = {
        chart: {
          type: 'multiBarChart',
          height: 450,
          color: d3.scale.category20().range(),
          margin: {
            top: 20,
            bottom: 60,
            left: 75
          },
          x: function ( d ) {
            return d[ 0 ];
          },
          y: function ( d ) {
            return d[ 1 ];
          },
          useVoronoi: false,
          clipEdge: true,
          stacked: true,
          showControls: false,
          transitionDuration: 500,
          useInteractiveGuideline: true,
          xAxis: {
            showMaxMin: false,
            tickFormat: function ( d ) {
              return d3.time.format( '%e/%m/%y' )( new Date( d ) )
            }
          },
          yAxis: {
            "axisLabel": "Distance (m)"
          }
        }
      };

      var elevationConfig = {
        chart: {
          type: 'multiBarChart',
          height: 450,
          margin: {
            top: 20,
            bottom: 60,
            left: 75
          },
          x: function ( d ) {
            return d[ 0 ];
          },
          y: function ( d ) {
            return d[ 1 ];
          },
          useVoronoi: false,
          clipEdge: true,
          stacked: true,
          showControls: false,
          transitionDuration: 500,
          useInteractiveGuideline: true,
          xAxis: {
            showMaxMin: false,
            tickFormat: function ( d ) {
              return d3.time.format( '%e/%m/%y' )( new Date( d ) )
            }
          },
          yAxis: {
            "axisLabel": "Hight (m)"
          }
        }
      };

      var sleepConfig = {
        chart: {
          type: 'multiBarHorizontalChart',
          height: 450,
          margin: {
            top: 20,
            bottom: 60,
            left: 75
          },
          x: function ( d ) {
            return d[ 0 ];
          },
          y: function ( d ) {
            return d[ 1 ];
          },
          useVoronoi: false,
          clipEdge: true,
          stacked: true,
          forceX: true,
          showControls: false,
          transitionDuration: 500,
          useInteractiveGuideline: true,
          xAxis: {
            showMaxMin: false,
            tickFormat: function ( d ) {
              return d3.time.format( '%e/%m/%y' )( new Date( d ) )
            }
          },
          yAxis: {
            "axisLabel": "Duration (min)",
            tickFormat: function ( d ) {
              var hours = Math.floor( d / 3600 );
              d %= 3600;
              var minutes = Math.floor( d / 60 );
              return hours + "h, " + minutes + "min";
            }
          }
        }
      };

      var wakeupConfig = {
        chart: {
          type: 'multiBarChart',
          height: 450,
          margin: {
            top: 20,
            bottom: 60,
            left: 75
          },
          x: function ( d ) {
            return d[ 0 ];
          },
          y: function ( d ) {
            return d[ 1 ];
          },
          useVoronoi: false,
          clipEdge: true,
          stacked: true,
          forceX: true,
          showControls: false,
          transitionDuration: 500,
          useInteractiveGuideline: true,
          xAxis: {
            showMaxMin: false,
            tickFormat: function ( d ) {
              return d3.time.format( '%e/%m/%y' )( new Date( d ) )
            }
          },
          yAxis: {
            "axisLabel": "Count"
          }
        }
      };

      var bodyConfig = {
        chart: {
          type: 'scatterChart',
          height: 450,
          margin: {
            top: 20,
            bottom: 60,
            left: 75
          },
          color: d3.scale.category10().range(),
          scatter: {
            "onlyCircles": false,
            "dispatch": {},
            "interactive": true,
            "padDataOuter": 0.1,
            "padData": false,
            "clipEdge": false,
            "clipVoronoi": true,
            "margin": {
              "top": 0,
              "right": 0,
              "bottom": 0,
              "left": 0
            },
            "duration": 250,
            "useVoronoi": true,
            "clearHighlights": null
          },
          showDistX: true,
          showDistY: true,
          tooltipContent: function ( key ) {
            return '<h3>' + key + '</h3>';
          },
          useVoronoi: false,
          clipEdge: true,
          showControls: false,
          transitionDuration: 500,
          xAxis: {
            showMaxMin: false,
            tickFormat: function ( d ) {
              return d3.time.format( '%e/%m/%y' )( new Date( d ) )
            }
          },
          yAxis: {
            "axisLabel": "Heart puslse (bpm) / SPO2 (%)"
          }
        }
      };


      return {
        intensityConfig: activityIntensityConfig,
        stepsConfig: stepsConfig,
        elevationConfig: elevationConfig,
        sleepConfig: sleepConfig,
        wakeupConfig: wakeupConfig,
        bodyConfig: bodyConfig
      };
    } ] );
})( angular );