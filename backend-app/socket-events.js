module.exports = function(io, WCUser, withings, grant){
    var userid = 6620563;

    io.on('connection', function (socket) {
        console.log('Connection recieved');

        socket.on('getUserData', function () {
            console.log('Fetching data for user:');

            WCUser.find({'meta.userid': userid}, function(err, user){
                if(err) throw err;




                var resdata = user.data;




                socket.emit('recieveData', resdata);
            });
        });


    });


};

