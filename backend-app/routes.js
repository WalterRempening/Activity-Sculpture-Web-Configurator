module.exports = function(app, WCUser, withings, grant, request) {
  var beginning = '2015-02-25'
  var today = new Date(Date.now()).toISOString().slice(0, 10);

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get('/withings_callback', function(req, res, next) {
    var activities;
    var apiurl = withings.generateUrl({
      url: "http://wbsapi.withings.net/v2/measure",
      parameters: {
        action: "getactivity",
        userid: req.query.raw.userid,
        startdateymd: beginning,
        enddateymd: today
      },
      consumer_key: grant.config.withings.key,
      consumer_secret: grant.config.withings.secret,
      access_token: req.query.access_token,
      access_token_secret: req.query.access_secret
    });

    request(apiurl, function(err, res, body) {
      if (err) throw err;
      var jbody = JSON.parse(body);
      console.log("Status:" + jbody.status);
      console.log(jbody.body.activities);
      activities = jbody.body.activities;

      WCUser.findOne({
        "meta.userid": req.query.raw.userid
      }, function(err, dbuser) {
        if (err) throw err;

        if (dbuser.length !== 0) {
          dbuser.activity = activities;
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
            },
            activity: activities
          }, function(err, user) {
            if (err) throw err;
            console.log(user);
          });
        }
      });
    });

    res.redirect('/#/connect/withings/callback');
  });

  app.get("/api/user/data", function(req, res, next) {

  });

};
