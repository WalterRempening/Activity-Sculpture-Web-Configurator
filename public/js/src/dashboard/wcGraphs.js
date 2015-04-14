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

    function prepareActivityGraphData(resData) {
      var graphData = [];
      var keys = Object.keys(resData[0]);
      keys.splice(0, 1); // delete timezone key
      keys.pop(); // delete Date key

      for (var j = 0; j < keys.length; j++) {
        graphData.push({
          "key": keys[j],
          "values": []
        });
        for (var i = 0; i < resData.length; i++) {
          graphData[j].values.push([
            new Date(resData[i].date), resData[i][keys[j]]
          ]);
        }
      }
      return {
        intensity: [
          graphData[0],
          graphData[1],
          graphData[2],
          graphData[4]
        ],
        elevation: [
          graphData[3]
        ],
        steps: [
          graphData[5],
          graphData[6]
        ]
      };
    }

    function prepareSleepGraphData(resData) {
      var graphData = [];
      var keys = Object.keys(resData[0].data);
      console.log(keys);
      for (var j = 0; j < keys.length; j++) {
        graphData.push({
          "key": keys[j],
          "values": []
        });
        for (var i = 0; i < resData.length; i++) {
          graphData[j].values.push([
            new Date(resData[i].date), resData[i].data[keys[j]]
          ]);
        }
      }
      return {
        depth: [
          graphData[0],
          graphData[2],
          graphData[3],
          graphData[4]
        ],
        wakeup: [
          graphData[1],
        ]
      };
    }

    return {
      intensityConfig: activityIntensityConfig,
      stepsConfig: stepsConfig,
      elevationConfig: elevationConfig,
      sleepConfig: sleepConfig,
      wakeupConfig: wakeupConfig,
      formatActivity: prepareActivityGraphData,
      formatSleepData: prepareSleepGraphData
    };
  }]);