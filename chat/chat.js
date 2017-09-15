var adjectives, animals;
var util            = require('../generatenames');
var RoomFactory     = require('./roomfactory');
var WaitingList     = require('./waitinglist');
var Client          = require('./client');
var sharedsession   = require("express-socket.io-session");
var _               = require("underscore");
var TIMEOUT         = 500;  // 0.5 seconds reconnection timeout
const chalk         = require('chalk');
var winston         = require('winston');

module.exports = function(server, app) {
    var module = {};
    var io = require('socket.io')(server);
    var clients = [];
    var idleClients = [];

    io.use(sharedsession(app.session, {
        autoSave:true
    }));

    var waiting = new WaitingList(new RoomFactory());

    /* On connection with client */
    io.on('connection', function(socket) {

        /* Helper functions to check if connection is old/expired */
        var isNewConnection = ! _.any(clients, function(client) {
            return client.sessionID === socket.handshake.sessionID;
        });
        var isOldConnection = _.any(idleClients, function(client) {
            return client.sessionID = socket.handshake.sessionID;
        });

        // Begin detailed logging of incoming connection
        winston.info(
            "User " +
            chalk.bold.underline(socket.handshake.sessionID) +
            " (session ID) has connected to server"
        );
        winston.info(
            "- Socket ID: " +
            chalk.bold.underline(socket.id)
        );
        winston.info(
            "- Remote IP : " +
            chalk.bold.underline(socket.request.connection.remoteAddress)
        );
        winston.info(
            "- User-Agent: " +
            chalk.bold.underline(socket.request.headers['user-agent']) + "\n"
        );

        if (isOldConnection) {
            /*
                Takes care of edge case where the client disconnects because of
                battery saving but then re-focuses the browser before
                the TIMEOUT (in seconds) has elapsed
            */

            // Log the fact that we've got an old connection reconnecting
            winston.warn(
                "User " +
                chalk.bold.underline(socket.handshake.sessionID) +
                " (session ID) is old connection:"
            );
            winston.warn(
                "- Reconnecting with " +
                chalk.bold.underline(socket) + "\n"
            );

            var client = _.find(idleClients, function (client) {
                return client.sessionID = socket.handshake.sessionID;
            });

            // Reconnects with the idle socket on the other end
            idleClients = _.without(idleClients, client);
            clients.push(client);
            client.assignSocket(socket);
            //client.reconnect();
        }
        else if (isNewConnection) {
            /*
                Otherwise, if new connection, create new client object and add
                to waiting queue.
            */
            var client = new Client(socket, waiting);
            clients.push(client);
            client.sessionID = socket.handshake.sessionID;
        }
        else {
            winston.warn(
                "User " +
                chalk.bold.underline(socket.handshake.sessionID) +
                " (session ID) is already connected, killing connection"
            );
            socket.emit('my-error', {type: 'already-connected'});
        }

        if (isOldConnection || isNewConnection) {
            client.socket.on('disconnecting', function(socket) {
                /*
                    this function is added upon connection and it's necessary to
                    cover edge-cases
                */

                clients = _.without(clients, client);

                if (client.room) {
                    /*
                        If the client is in a chat we don't want him to
                        disconnect immediately
                    */

                    idleClients.push(client);

                    /*
                        This system is kind of shit, but for some reason
                        socket.io does not fire a reconnect. Edge cases, duh.
                    */
                    setTimeout(function () {
                        // wait one minute before officially disconnecting
                        if ( idleClients.indexOf(client) !== -1 ) {
                            // if it's not reconnected
                            idleClients = _.without(idleClients, client);
                            winston.warn(
                                "User " +
                                chalk.bold.underline(client.sessionID) +
                                " (session ID) is disconnected"
                            );
                            // disconnect it for good
                            client.disconnect();
                        }
                    }, TIMEOUT);
                } else {
                    winston.warn(
                        "User " +
                        chalk.bold.underline(client.sessionID) +
                         " (session ID)'s socket disconnected " + chalk.bold.red("(TIMEOUT)")
                    );
                    // if the client is waiting for a match just kill it
                    client.disconnect();
                }
            });
        }
    });

    return module;
};
