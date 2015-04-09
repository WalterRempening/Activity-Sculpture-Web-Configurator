var request = require('request');
var wApi = require('./withingsApi');
var WCUser = require('./models/user');
var today = new Date(Date.now()).toISOString().slice(0, 10);

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Accress-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get('/withings_callback', function(req, res, next) {
    console.log('')
    console.log(req);

    WCUser.findOne({
      "meta.userid": req.query.raw.userid
    }, function(err, dbuser) {
      if (err) throw err;

      if (dbuser.length !== 0) {
        dbuser.save(function(err) {
          if (err) throw err;
          console.log('Updated dbuser');
        });

      } else {
        console.log("User not found, creating new user")
        WCUser.create({
          oauth: {
            token: req.query.access_token,
            token_secret: req.query.access_secret
          },
          meta: {
            userid: req.query.raw.userid,
            deviceid: req.query.raw.deviceid
          }
        }, function(err, user) {
          if (err) throw err;
          console.log(user);
        });
      }
    });

    res.redirect('/#/user/' + req.query.raw.userid);

  });

  app.get("/api/user/:id/data/activity", function(req, res, next) {
    var userid = req.params.id;
    var activities;
    var options = {
      userid: userid,
      enddate: today,
      access_token: req.query.access_token,
      access_secret: req.query.access_secret
    };

    var queryUrl = wApi.activityQuery(options);
    request(queryUrl, function(err, res, body) {
      if (err) throw err;

      var jbody = JSON.parse(body);
      console.log(jbody.body.activities);
      activities = sortByDate(jbody.body.activities);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        dbuser.activity = activities;
        dbuser.save(function(err) {
          if (err) throw err;
        });
      });

    });

  });

  app.get("/api/user/:id/data/sleep", function(req, res, next) {
    var userid = req.params.id;
    var sleepSum;
    var options = {
      userid: userid,
      enddate: today,
      access_token: req.query.access_token,
      access_secret: req.query.access_secret
    };

    var queryUrl = wApi.sleepSummaryQuery(options);
    request(queryUrl, function(err, res, body) {
      if (err) throw err;

      var jbody = JSON.parse(body);
      console.log(jbody.body.activities);
      sleepSum = sortByDate(jbody.body.activities);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        dbuser.sleep = sleepSum;
        dbuser.save(function(err) {
          if (err) throw err;
        });
      });

    });
  });

  app.get("/api/user/:id/data/body", function(req, res, next) {
    var userid = req.params.id;
    var body;
    var options = {
      userid: userid,
      enddate: today,
      access_token: req.query.access_token,
      access_secret: req.query.access_secret
    };

    var queryUrl = wApi.bodyQuery(options);
    request(queryUrl, function(err, res, body) {
      if (err) throw err;

      var jbody = JSON.parse(body);
      console.log(jbody.body.activities);
      body = sortByDate(jbody.body.activities);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        dbuser.body = body;
        dbuser.save(function(err) {
          if (err) throw err;
        });
      });
    });
  });
};

function sortByDate(data) {
  for (var i = 1; i < data.length; i++) {
    var temp = data[i];
    for (var j = i - 1; j >= 0 && new Date(data[j].date) > new Date(temp.date); j--) {
      data[j + 1] = data[j];
    }
    data[j + 1] = temp
  }
  return data;
};