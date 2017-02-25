var adjectives, animals;
var util = require('../util');
var RoomHandler = require('./roomhandler')
var WaitingList = require('./waitinglist')
var Client = require('./client')

module.exports = function(app) {
    var module = {};
    var io = require('socket.io')(app);
    var waiting = new WaitingList(new RoomHandler()); // TODO change this to a better data structure
    var clients = [];

    io.on('connection', function(socket) {
        console.log("socket connected");
        var client = new Client(socket, waiting);
        clients.push(client);
    });

    return module;
};
