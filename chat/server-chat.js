module.exports = function(server, app) {
    var io      = require('socket.io')(server);
    const chalk = require('chalk');
    var winston = require('winston');
    var columnify = require('columnify')

    io.on('connection', function(socket){

        /* Socket listeners */
        socket.on('requestQueue', function(msg) {
            /* Logs basic connection information to console */
            winston.info(
                "A client has submitted a queue request to socket " +
                chalk.bold.underline(socket.id) + ": "
            );
            winston.info(
                "- Remote IP : " +
                chalk.bold.underline(socket.request.connection.remoteAddress)
            );
            winston.info(
                "- User-Agent: " +
                chalk.bold.underline(socket.request.headers['user-agent'])
            );
            winston.info("- selfGender: " + chalk.bold.underline(msg.selfGender));
            winston.info("- lookingfor: " + chalk.bold.underline(msg.partnerGender));
            winston.info("- romantic ?: " + chalk.bold.underline(msg.romance));
            winston.info("- activities: " + chalk.bold.underline(msg.activities));
        });

        socket.on('disconnect', function(){
            winston.info(
                "A client has disconnected from socket " +
                chalk.bold.underline(socket.id)
            );
        });
    });

    return module;
};
