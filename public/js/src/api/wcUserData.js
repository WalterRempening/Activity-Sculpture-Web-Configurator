'use strict';
angular.module('wcUserData', [])
  .factory('UserDataFactory',
  ['$http', 'SocketFactory', '$cookies', '$mdDialog', function($http,
                                                               SocketFactory,
                                                               $cookies,
                                                               $mdDialog) {

    var sessuser = JSON.parse($cookies.user);
    var settings = JSON.parse($cookies.settings);

    var DATA_RESPONSE_ERROR= 'An error was found while fetching data for your user. Try again later';
    var SAVE_SETTINGS_RESPONSE_ERROR = 'User settings could not be saved';

    // initialize user object
    var user = {
      profile: [],
      id: sessuser.id,
      sleep: {
        depth: [],
        wakeup: []
      },
      activity: {
        steps: [],
        elevation: [],
        intensity: []
      },
      body: [],
      config: {
        startdate: "",
        enddate: ""
      }
    };

    // setters and getters for module
    function getUser() {return user;}

    function getUserProfile() {return user.profile;}

    function setUserProfile(data) {user.profile = data;}

    function getUserSleep() {return user.sleep;}

    function setUserSleep(data) {
      user.sleep.depth = data.depth;
      user.sleep.wakeup = data.wakeup;
    }

    function getUserActivity() {return user.activity;}

    function setUserActivity(data) {
      user.activity.steps = data.steps;
      user.activity.elevation = data.elevation;
      user.activity.intensity = data.intensity;
    }

    function setDates(dates) {
      user.config.startdate = dates.startdate;
      user.config.enddate = dates.enddate;
    }

    function errorDialog(msg) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Server Error')
          .content(msg)
          .ariaLabel('Server Error Dialog')
          .ok('OK')
      );
    }

    function saveSettings(settings){
      $http.post("/api/user/" + user.id +"/settings", settings)
        .succes(function(data, status, headers, config) {
          console.log('User saved succesfully');
        })
        .error(function(data, status, headers, config) {
          if (status == 500) errorDialog(SAVE_SETTINGS_RESPONSE_ERROR);
        });
    }

    function init() {
      // Query User Data to API======================================
      $http.get("/api/user/" + user.id + "/data/activity")
        .success(function(data, status, headers, config) {
          SocketFactory.emit('get:user:activity', user.id);
        })
        .error(function(data, status, headers, config) {
          // Display error dialog
          if (status === 500) errorDialog(DATA_RESPONSE_ERROR);
        });

      $http.get("/api/user/" + user.id + "/data/sleep")
        .success(function(data, status, headers, config) {
          SocketFactory.emit('get:user:sleep', user.id);
        })
        .error(function(data, status, headers, config) {
          if (status === 500) errorDialog(DATA_RESPONSE_ERROR);
        });

      $http.get("/api/user/" + user.id + "/data/body")
        .success(function(data, status, headers, config) {
          SocketFactory.emit('get:user:body', user.id);
        })
        .error(function(data, status, headers, config) {
          if (status === 500) errorDialog(DATA_RESPONSE_ERROR);
        });


      $http.get("/api/user/" + user.id + "/data/profile")
        .success(function(data, status, headers, config) {
          SocketFactory.emit('get:user:profile', user.id);
        })
        .error(function(data, status, headers, config) {
          if (status === 500) errorDialog(DATA_RESPONSE_ERROR);
        });
    }

    //receive user data through sockets =============================
    var progress = 0;

    function getProgress() {return progress};

    SocketFactory.on('receive:user:activity', function(responseData) {
      var data = formatActivity(responseData);
      user.activity = data;
      //console.log(user.activity);
      progress++;
    });

    SocketFactory.on('receive:user:sleep', function(responseData) {
      var data = formatSleepData(responseData);
      user.sleep = data;
      //console.log(user.sleep);
      progress++;
    });

    SocketFactory.on('receive:user:body', function(responseData) {
      user.body = responseData;
      //console.log('receive user body' + responseData);
      progress++;
    });

    SocketFactory.on('receive:user:profile', function(responseData) {
      user.profile = responseData;
      //console.log(user.profile);
      progress++;
    });

    //Reorganize activty and sleep data for graphs/models =============================
    function formatActivity(resData) {
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

    function formatSleepData(resData) {
      var graphData = [];
      var keys = Object.keys(resData[0].data);
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
      init: init,
      getUser: getUser,
      getUserProfile: getUserProfile,
      setUserProfile: setUserProfile,
      getUserSleep: getUserSleep,
      setUserSleep: setUserSleep,
      getUserActivity: getUserActivity,
      setUserActivity: setUserActivity,
      getProgress: getProgress,
      setDates: setDates
    };


  }]);