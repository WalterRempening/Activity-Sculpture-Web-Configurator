var WCUser = require('./models/user');

module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log('Connection received');

    socket.on('get:user:activity', function(userid) {
      console.log('Searching data for user:' + userid);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        var resdata = dbuser.activity;

        console.log('Sending activity data');
        //console.log(resdata);
        socket.emit('receive:user:activity', resdata);
      });
    });

    socket.on('get:user:sleep', function(userid) {
      console.log('Searching data for user:' + userid);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        var resdata = dbuser.sleep;

        console.log('Sending sleep data');
        //console.log(resdata);
        socket.emit('receive:user:sleep', resdata);
      });
    });

    socket.on('get:user:body', function(userid) {
      console.log('Searching data for user:' + userid);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        var resdata = dbuser.body;

        console.log('Sending body data');
        //console.log(resdata);
        socket.emit('receive:user:body', resdata);
      });
    });

    socket.on('get:user:profile', function(userid) {
      console.log('Searching data for user:' + userid);

      WCUser.findOne({'meta.userid': userid}, function(err, dbuser) {
        if (err) throw err;
        var resdata = {
          name: dbuser.name,
          id: dbuser.meta.userid,
          gender: dbuser.gender,
          birthdate: dbuser.birthdate
        };

        console.log('Sending user data');
        console.log(resdata);
        socket.emit('receive:user:profile', resdata);
      });
    });
  });
};

