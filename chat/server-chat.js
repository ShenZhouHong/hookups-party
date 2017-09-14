module.exports = function(server, app) {
    var io          = require('socket.io')(server);
    const chalk     = require('chalk');
    var winston     = require('winston');
    var sexynames   = require('../generatenames');

    var sexynameGen = sexynames();

    function ticket (socketID, remoteIP, useragent, userPreferences){
        /*
            Uses a train ticket as a metaphor. When a user wishes requests form
            a position in the queue, a ticket is issued to them with all the
            relevant information (gender, etc.)
        */
        this.name           = sexynameGen.generateName();
        this.socketID       = socketID;

        this.remoteIP       = remoteIP;
        this.useragent      = useragent;

        this.selfGender     = userPreferences.selfGender;
        this.romance        = userPreferences.romance;
        this.partnerGender  = userPreferences.partnerGender;
        this.activities     = userPreferences.activities;
    };

    io.on('connection', function(socket){

        /* Socket listeners */
        socket.on('requestQueue', function(msg) {

            /* creates a queue ticket for the client */
            var Client = new ticket(
                socket.id,
                socket.request.connection.remoteAddress,
                socket.request.headers['user-agent'],
                msg
            );

            /* Logs basic connection information to console */
            winston.info(
                "A client has submitted a queue request to socket " +
                chalk.bold.underline(Client.socketID) + ": "
            );
            winston.info(
                "- Remote IP : " +
                chalk.bold.underline(Client.remoteIP)
            );
            winston.info(
                "- User-Agent: " +
                chalk.bold.underline(Client.useragent)
            );
            winston.info("- selfGender: " + chalk.bold.underline(Client.selfGender));
            winston.info("- lookingfor: " + chalk.bold.underline(Client.partnerGender));
            winston.info("- romantic ?: " + chalk.bold.underline(Client.romance));
            winston.info("- activities: " + chalk.bold.underline(Client.activities));

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
