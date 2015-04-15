'use strict';
angular.module('wcGraphs', [])
  .factory('GraphFactory', [function() {
    var activityIntensityConfig = {
      chart: {
        type: 'multiBarChart',
        height: 450,
        margin: {
          top: 20,
          bottom: 60,
          left: 75
        },
        x: function(d) {
          return d[0];
        },
        y: function(d) {
          return d[1];
        },
        useVoronoi: false,
        clipEdge: true,
        stacked: true,
        showControls: false,
        transitionDuration: 500,
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickFormat: function(d) {
            return d3.time.format('%e/%m/%y')(new Date(d))
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
        margin: {
          top: 20,
          bottom: 60,
          left: 75
        },
        x: function(d) {
          return d[0];
        },
        y: function(d) {
          return d[1];
        },
        useVoronoi: false,
        clipEdge: true,
        stacked: true,
        showControls: false,
        transitionDuration: 500,
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickFormat: function(d) {
            return d3.time.format('%e/%m/%y')(new Date(d))
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
        x: function(d) {
          return d[0];
        },
        y: function(d) {
          return d[1];
        },
        useVoronoi: false,
        clipEdge: true,
        stacked: true,
        showControls: false,
        transitionDuration: 500,
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickFormat: function(d) {
            return d3.time.format('%e/%m/%y')(new Date(d))
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
        x: function(d) {
          return d[0];
        },
        y: function(d) {
          return d[1];
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
          tickFormat: function(d) {
            return d3.time.format('%e/%m/%y')(new Date(d))
          }
        },
        yAxis: {
          "axisLabel": "Duration (min)",
          tickFormat: function(d) {
            var hours = Math.floor(d / 3600);
            d %= 3600;
            var minutes = Math.floor(d / 60);
            return hours+"h, " + minutes+"min";
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
        x: function(d) {
          return d[0];
        },
        y: function(d) {
          return d[1];
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
          tickFormat: function(d) {
            return d3.time.format('%e/%m/%y')(new Date(d))
          }
        },
        yAxis: {
          "axisLabel": "Count"
        }
      }
    };



    return {
      intensityConfig: activityIntensityConfig,
      stepsConfig: stepsConfig,
      elevationConfig: elevationConfig,
      sleepConfig: sleepConfig,
      wakeupConfig: wakeupConfig
    };
  }]);