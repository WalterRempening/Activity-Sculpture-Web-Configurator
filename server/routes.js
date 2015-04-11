var request = require('request');
var wApi = require('./withingsApi');
var WCUser = require('./models/user');

var today = new Date(Date.now()).toISOString().slice(0, 10);
var utc = today.split('-');
var utctoday = Date.UTC(utc[0], utc[1], utc[2]) / 1000;

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
      //session = req.session;
      //session.auth = req.query;

      console.log(req);
      res.redirect('/#/user/' + req.user.id);
    }
  );

  app.get("/api/user/:id/data/activity", function(req, res, next) {
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
    res.end();
  });

  app.get("/api/user/:id/data/sleep", function(req, res, next) {
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
    request(queryUrl, function(err, res, body) {
      if (err) throw err;

      var jbody = JSON.parse(body);
      console.log(jbody.body.series);
      sleepSum = sortByDate(jbody.body.series);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        dbuser.sleep = sleepSum;
        dbuser.save(function(err) {
          if (err) throw err;
        });
      });
    });

    res.end();
  });

  app.get("/api/user/:id/data/body", function(req, res, next) {
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
    request(queryUrl, function(err, res, body) {
      if (err) throw err;
      var jbody = JSON.parse(body);
      console.log(jbody);
      bodymes = sortByDate(jbody.body.measuregrps);
      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        dbuser.body = bodymes;
        dbuser.save(function(err) {
          if (err) throw err;
        });
      });
    });

    res.end();
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