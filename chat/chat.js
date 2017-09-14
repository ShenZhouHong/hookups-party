var adjectives, animals;
var util            = require('../generatenames');
var RoomFactory     = require('./roomfactory');
var WaitingList     = require('./waitinglist');
var Client          = require('./client');
var sharedsession   = require("express-socket.io-session");
var _               = require("underscore");
var TIMEOUT         = 10000;  // 10 seconds reconnection timeout
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
        var isNewConnection = ! _.any(clients, function(client) {
            return client.sessionID === socket.handshake.sessionID;
        });

        /* Begin detailed logging of connection */
        winston.info(
            "A client has submitted a queue request to socket " +
            chalk.bold.underline(socket.id) + ": "
        );
        winston.info(
            "- Session ID: " +
            chalk.bold.underline(socket.handshake.sessionID)
        );
        winston.info(
            "- Remote IP : " +
            chalk.bold.underline(socket.request.connection.remoteAddress)
        );
        winston.info(
            "- User-Agent: " +
            chalk.bold.underline(socket.request.headers['user-agent'])
        );

        var isOldConnection = _.any(idleClients, function(client) {
            return client.sessionID = socket.handshake.sessionID;
        });
        if (isOldConnection) {  // edge case: the client disconnects because of battery saving but then re-focuses the browser before TIMEOUT has elapsed
            var client = _.find(idleClients, function (client) {
                return client.sessionID = socket.handshake.sessionID;
            });
            idleClients = _.without(idleClients, client);
            clients.push(client);
            client.assignSocket(socket);
            //client.reconnect();
        } else if (isNewConnection) {
            var client = new Client(socket, waiting);
            clients.push(client);
            client.sessionID = socket.handshake.sessionID;
        } else {
            socket.emit('my-error', {type: 'already-connected'});
        }

        if (isOldConnection || isNewConnection) {
            client.socket.on('disconnecting', function(socket) {  // this function is added upon connection and it's necessary to cover edge-cases
                clients = _.without(clients, client);
                if (client.room) {  // if the client is in a chat we don't want him to disconnect immediately
                    idleClients.push(client);
                    // This system is kind of shit, but for some reason socket.io does not fire a reconnect. Edge cases, duh.
                    setTimeout(function () {  // wait one minute before officially disconnecting
                        if ( idleClients.indexOf(client) !== -1 ) {  // if it's not reconnected
                            idleClients = _.without(idleClients, client);  // disconnect it for good
                            client.disconnect();
                        }
                    }, TIMEOUT);
                } else {
                    client.disconnect();  // if the client is waiting for a match just kill it
                }
            });
        }
    });


    return module;
};
