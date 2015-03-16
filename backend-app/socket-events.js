module.exports = function(io){

    io.on('connection', function (socket) {
        console.log('Connection recieved');

        socket.emit('gotYou', 'I got you');

        socket.on('gotYou2', function (msg) {
            console.log(msg);

            socket.emit('gotYou', 'not much dawg');
        });


    });


};

