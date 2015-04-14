var request = require('request');
var wApi = require('./withingsApi');
var WCUser = require('./models/user');

var today = new Date(Date.now()).toISOString().slice(0, 10);
var utc = today.split('-');
var utctoday = Date.UTC(utc[0], utc[1], utc[2]) / 1000;

function ensureAuthorized(req, res, next) {
  if (!req.user || req.user.logged === 'undefined') {
    res.sendStatus(403);
    return;
  } else {
    return next();
  }
}

function cleanUpDates(data) {
  var cleanData = [];

  for (var k = 0; k < data.length; k++) {
    var currentDate = Date.parse(data[k].date);
    console.log(currentDate);
    if(k < data.length-1) {
      if (currentDate !== Date.parse(data[k + 1].date)) {
        cleanData.push(data[k]);
      }
    }else{
      cleanData.push(data[k]);
    }

  }
  console.log(cleanData);
  return cleanData;
}

function sortByDate(data) {
  for (var i = 1; i < data.length; i++) {
    var temp = data[i];
    for (var j = i - 1; j >= 0 && new Date(data[j].date) > new Date(temp.date); j--) {
      data[j + 1] = data[j];
    }
    data[j + 1] = temp
  }
  return data;
}

module.exports = function(app, passport) {
  app.use(function(req, res, next) {
    res.header("Accress-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get('/auth/withings', passport.authenticate('withings'),
    function(req, res, next) {
      console.log("Withings flow called");
    });

  app.get('/auth/withings/callback', passport.authenticate('withings',
      {
        failureRedirect: '/'
      }),
    function(req, res, next) {
      console.log(req);
      res.redirect('/#/user/' + req.user.id);
    }
  );

  app.get("/api/user/:id/data/activity", ensureAuthorized,
    function(req, res, next) {
      var activities;
      var userid = req.user.id;
      var options = {
        userid: userid,
        enddate: today,
        access_token: req.user.token,
        access_secret: req.user.secret
      };

      console.log(queryUrl);
      var queryUrl = wApi.activityQuery(options);
      request(queryUrl, function(err, wres, body) {
        if (err) {
          throw err;
          res.sendStatus(500);
        }

        var jbody = JSON.parse(body);
        //console.log(jbody.body.activities);
        activities = sortByDate(jbody.body.activities);

        WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
          if (err) throw err;
          dbuser.activity = activities;
          dbuser.save(function(err) {
            if (err) throw err;
            res.end();
          });
        });
      });
    });

  app.get("/api/user/:id/data/sleep", ensureAuthorized,
    function(req, res, next) {
      var sleepSum;
      var userid = req.user.id;
      var options = {
        userid: userid,
        enddate: today,
        access_token: req.user.token,
        access_secret: req.user.secret
      };

      console.log(queryUrl);
      var queryUrl = wApi.sleepSummaryQuery(options);
      request(queryUrl, function(err, wres, body) {
        if (err) {
          res.sendStatus(500);
          throw err;
        }

        var jbody = JSON.parse(body);
        console.log(jbody.body.series);
        var sortedData = sortByDate(jbody.body.series);
        sleepSum = cleanUpDates(sortedData);
        console.log(sleepSum);
        WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
          if (err) throw err;
          dbuser.sleep = sleepSum;
          dbuser.save(function(err) {
            if (err) throw err;
            res.end();
          });
        });
      });
    });

  app.get("/api/user/:id/data/body", ensureAuthorized,
    function(req, res, next) {
      var bodymes;
      var userid = req.user.id;
      var options = {
        userid: userid,
        enddate: utctoday,
        access_token: req.user.token,
        access_secret: req.user.secret
      };

      var queryUrl = wApi.bodyQuery(options);
      console.log(queryUrl);
      request(queryUrl, function(err, wres, body) {
        if (err) {
          res.sendStatus(500);
          throw err;
        }
        var jbody = JSON.parse(body);
        console.log(jbody);
        bodymes = sortByDate(jbody.body.measuregrps);
        WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
          if (err) throw err;
          dbuser.body = bodymes;
          dbuser.save(function(err) {
            if (err) throw err;
            res.end();
          });
        });
      });
    });

  app.get("/api/user/:id/data/profile", ensureAuthorized,
    function(req, res, next) {
      var profile;
      var userid = req.user.id;
      var options = {
        userid: userid,
        access_token: req.user.token,
        access_secret: req.user.secret
      };

      var queryUrl = wApi.userQuery(options);
      console.log(queryUrl);
      request(queryUrl, function(err, wres, body) {
        if (err) {
          res.sendStatus(500);
          throw err;
        }
        var jbody = JSON.parse(body);
        console.log(jbody);
        profile = jbody.body.users[0];
        console.log(profile);
        WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
          if (err) throw err;
          dbuser.name = profile.firstname + " " + profile.lastname;
          dbuser.gender = profile.gender;
          dbuser.birthdate = new Date(profile.birthdate * 1000);

          dbuser.save(function(err) {
            if (err) throw err;
            res.end();
          });
        });
      });
    });
};