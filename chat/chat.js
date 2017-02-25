var adjectives, animals;
var util = require('../generatenames');
var RoomFactory = require('./roomfactory');
var WaitingList = require('./waitinglist');
var Client = require('./client');

module.exports = function(app) {
    var module = {};
    var io = require('socket.io')(app);
    var waiting = new WaitingList(new RoomFactory());
    var clients = [];

    io.on('connection', function(socket) {
        var client = new Client(socket, waiting);
        clients.push(client);
    });

    return module;
};
