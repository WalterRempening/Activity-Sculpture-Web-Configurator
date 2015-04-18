var WCUser = require('./models/user');

module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log('Connection received');

    socket.on('get:user:activity', function(userid) {
      console.log('Searching activity for user:' + userid);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        var resdata = dbuser.data.activity;

        console.log('Sending activity data');
        //console.log(resdata);
        socket.emit('receive:user:activity', resdata);
      });
    });

    socket.on('get:user:sleep', function(userid) {
      console.log('Searching sleep for user:' + userid);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        var resdata = dbuser.data.sleep;

        console.log('Sending sleep data');
        //console.log(resdata);
        socket.emit('receive:user:sleep', resdata);
      });
    });

    socket.on('get:user:body', function(userid) {
      console.log('Searching body for user:' + userid);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        var resdata = dbuser.data.body;

        console.log('Sending body data');
        //console.log(resdata);
        socket.emit('receive:user:body', resdata);
      });
    });

    socket.on('get:user:profile', function(userid) {
      console.log('Searching profile for user:' + userid);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        var resdata = {
          name: dbuser.profile.name,
          age: dbuser.profile.age,
          gender: dbuser.profile.gender,
          id: dbuser.meta.userid
        };

        console.log('Sending profile data');
        //console.log(resdata);
        socket.emit('receive:user:profile', resdata);
      });
    });

  });
};

