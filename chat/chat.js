var adjectives, animals;
var util = require('../generatenames');
var RoomFactory = require('./roomfactory');
var WaitingList = require('./waitinglist');
var Client = require('./client');
var sharedsession = require("express-socket.io-session");
var _ = require("underscore");

module.exports = function(server, app) {
    var module = {};
    var io = require('socket.io')(server);
    var clients = [];

    io.use(sharedsession(app.session, {
        autoSave:true
    })); 

    var waiting = new WaitingList(new RoomFactory());

    io.on('connection', function(socket) {
        console.log("connection");
        var isNewConnection = ! _.any(clients, function(client) {
            return client.sessionID === socket.handshake.sessionID;
        });

        if (isNewConnection) {
            var client = new Client(socket, waiting);
            clients.push(client);
            client.sessionID = socket.handshake.sessionID;
            console.log("valid connection");
            client.socket.on('disconnecting', function(socket) {
                clients = _.without(clients, client);
                client.disconnect();
            });
        } else {
            socket.emit('my-error', {type: 'already-connected'});
        }
    });


    return module;
};
