module.exports = function(app) {
    var module = {}
    var io = require('socket.io')(app);

    io.on('connection', function(socket){
      console.log('a user connected');
      socket.on('disconnect', function(){
        console.log('user disconnected');
      });

      socket.on('chat message', function(msg){
        io.emit('chat message', msg);
      });
    });
    return module
}
