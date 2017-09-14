module.exports = function(server, app) {
    var io      = require('socket.io')(server);
    const chalk = require('chalk');

    io.on('connection', function(socket){
        console.log(
            chalk.bold.bgBlue("INFO:") + " " +
            "A client has connected to socket " + chalk.bold.underline(socket.id) + ": " +
            "\n      Remote IP : " + chalk.bold.underline(socket.request.connection.remoteAddress) +
            "\n      User-Agent: " + chalk.bold.underline(socket.request.headers['user-agent'])

        );

        socket.on('requestQueue', function(msg) {
            console.log(
                "\n      UserPrefs :" + msg
            );
        });

        socket.on('disconnect', function(){
            console.log(
                chalk.bold.bgBlue("INFO:") + " " +
                "A client has disconnected from socket " +
                chalk.bold.underline(socket.id)
            );
        });
    });

    return module;
};
