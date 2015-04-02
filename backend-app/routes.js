module.exports = function(app, WCUser, withings, grant, request) {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get('/withings_callback', function(req, res, next) {
    console.log(req.query);
    var user = new WCUser({
      oauth: {
        token: req.query.access_token,
        token_secret: req.query.access_secret
      },
      meta: {
        userid: req.query.raw.userid,
        deviceid: req.query.raw.deviceid
      }
    });

    WCUser.find({'meta.userid': req.query.raw.userid},
      function(err, user) {
        if (err) throw err;

        if (user.length === 0) {
          console.log("User not found, creating new user")
          user.save(function(err) {
            if (err) {
              console.log(err);
              throw err;
            }
          });
        }
        else {
          console.log("User " + req.query.raw.userid + " found");
        }

        console.log(user);
        var apiurl = withings.generateUrl({
          url: "http://wbsapi.withings.net/v2/measure",
          parameters: {
            action: "getactivity",
            userid: user[0].meta.userid,
            date: "2015-03-30"
          },
          consumer_key: grant.config.withings.key,
          consumer_secret: grant.config.withings.secret,
          access_token: user[0].oauth.token,
          access_token_secret: user[0].oauth.token_secret
        });

        request(apiurl, function(err, res, body) {
          if (err) throw err;
          console.log(JSON.stringify(body));

        });


        res.redirect('/#/connect/withings/callback');

      });
  });

  app.get("/api/user/data", function(req, res, next) {

  });

  app.get("/api/login/", function(req, res, next) {
    res.redirect('/connect/withings')
  });
};
