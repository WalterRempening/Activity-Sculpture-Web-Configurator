// app/routes.js

// grab the nerd model we just created
var WCUser = require('./models/user');

module.exports = function(app) {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get('/withings_callback', function(req, res, next) {
    console.log(req.query);



    res.redirect('/#/connect/withings/callback');
  });

  app.post("/api/login/", function(req, res, next){
    console.log(req.body);
    res.co
  });

  // route to handle creating goes here (app.post)
  // route to handle delete goes here (app.delete)


};
