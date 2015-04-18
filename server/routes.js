var request = require('request');
var wApi = require('./withingsApi');
var WCUser = require('./models/user');

function ensureAuthorized(req, res, next) {
  if (!req.user) {
    return res.sendStatus(403);
  } else {
    return next();
  }
}

function cleanUpDates(data) {
  var cleanData = [];
  for (var k = 0; k < data.length; k++) {
    var currentDate = Date.parse(data[k].date);
    if (k < data.length - 1) {
      if (currentDate !== Date.parse(data[k + 1].date)) {
        cleanData.push(data[k]);
      }
    } else {
      cleanData.push(data[k]);
    }
  }
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
      res.cookie('user', JSON.stringify(req.user), {maxAge: 2592000000});
      res.redirect('/#/user/' + req.user.id);
    }
  );

  app.get("/api/user/:id/settings", ensureAuthorized,
    function(req, res, next) {
      WCUser.findOne({'meta.userid': req.user.id}, function(err, dbuser) {
        if (!err) {
          if(dbuser.settings.startDate !== undefined) {
            res.cookie('settings', JSON.stringify(dbuser.settings));
            res.send(dbuser.settings);
          }else{
            console.log('User settings NOT found');
            res.send('undefined');
          }
        } else {
          console.log('Error retreiving user settings');
          res.sendStatus(500);
      }
    });
}
)
;

app.post("/api/user/:id/settings", ensureAuthorized,
  function(req, res, next) {
    var setup = JSON.parse(req.cookies.settings);
    WCUser.findOne({'meta.userid': req.user.id}, function(err, dbuser) {
      if (!err) {
        dbuser.profile.age = setup.age;
        dbuser.profile.gender = setup.gender;
        dbuser.profile.location = setup.city + ", " + setup.country;
        dbuser.settings.startDate = setup.startDate;
        dbuser.settings.endDate = setup.endDate;
        dbuser.settings.show = setup.show;
        dbuser.save(function(err) {
          if (err) throw err;
          res.end();
        });
      } else {
        res.sendStatus(500);
      }
    });
  });

app.get("/api/user/:id/data/activity", ensureAuthorized,
  function(req, res, next) {

    var settings = JSON.parse(req.cookies.settings);
    var activities;
    var userid = req.user.id;
    var options = {
      userid: userid,
      startDate: wApi.formatDate(settings.startDate, wApi.constNormal),
      endDate: wApi.formatDate(settings.endDate, wApi.constNormal),
      access_token: req.user.token,
      access_secret: req.user.secret
    };

    console.log(queryUrl);
    var queryUrl = wApi.activityQuery(options);
    request(queryUrl, function(err, wres, body) {
      if (!err && JSON.parse(body).status === 0) {
        var jbody = JSON.parse(body);
        //console.log(jbody.body.activities);
        activities = sortByDate(jbody.body.activities);

        WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
          if (err) throw err;
          dbuser.data.activity = activities;
          dbuser.save(function(err) {
            if (err) throw err;
            res.end();
          });
        });
      } else {
        res.sendStatus(500);
      }
    });
  });

app.get("/api/user/:id/data/sleep", ensureAuthorized,
  function(req, res, next) {
    var sleepSum;
    var userid = req.user.id;
    var settings = JSON.parse(req.cookies.settings);
    var options = {
      userid: userid,
      startDate: wApi.formatDate(settings.startDate, wApi.constNormal),
      endDate: wApi.formatDate(settings.endDate, wApi.constNormal),
      access_token: req.user.token,
      access_secret: req.user.secret
    };

    console.log(queryUrl);
    var queryUrl = wApi.sleepSummaryQuery(options);
    request(queryUrl, function(err, wres, body) {
      if (!err && JSON.parse(body).status === 0) {
        var jbody = JSON.parse(body);
        //console.log(jbody.body.series);
        var sortedData = sortByDate(jbody.body.series);
        sleepSum = cleanUpDates(sortedData);
        //console.log(sleepSum);
        WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
          if (err) throw err;
          dbuser.data.sleep = sleepSum;
          dbuser.save(function(err) {
            if (err) throw err;
            res.end();
          });
        });
      } else {
        res.sendStatus(500);
      }
    });
  });

app.get("/api/user/:id/data/body", ensureAuthorized,
  function(req, res, next) {
    var bodymes;
    var userid = req.user.id;
    var settings = JSON.parse(req.cookies.settings);
    var options = {
      userid: userid,
      startDate: wApi.formatDate(settings.startDate, wApi.constUTC),
      endDate: wApi.formatDate(settings.endDate, wApi.constUTC),
      access_token: req.user.token,
      access_secret: req.user.secret
    };

    var queryUrl = wApi.bodyQuery(options);
    //console.log(queryUrl);
    request(queryUrl, function(err, wres, body) {
      if (!err && JSON.parse(body).status === 0) {
        var jbody = JSON.parse(body);
        //console.log(jbody);
        bodymes = sortByDate(jbody.body.measuregrps);
        WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
          if (err) throw err;
          dbuser.data.body = bodymes;
          dbuser.save(function(err) {
            if (err) throw err;
            res.end();
          });
        });
      } else {
        res.sendStatus(500);
      }
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
    request(queryUrl, function(err, wres, body) {
      if (!err && JSON.parse(body).status === 0) {
        var jbody = JSON.parse(body);
        //console.log(jbody);
        profile = jbody.body.users[0];
        //console.log(profile);
        WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
          if (err) throw err;
          dbuser.profile.name = profile.firstname + " " + profile.lastname;
          dbuser.save(function(err) {
            if (err) throw err;
            res.end();
          });
        });
      } else {
        res.sendStatus(500);
      }
    });
  });
}
;