var _       = require('underscore');
const chalk = require('chalk');
var winston = require('winston');
/*
    Provides a higher abstraction level that socket.io rooms.
    A Room has a name and a list of conencted sockets.
    Only to be instantiated using RoomFactory.newRoom, otherwise the name could
    collide with other used names, resulting in weird errors
*/
function Room (name) {
    this.name = name; // Do NOT change this attribute after instantiation
    this.sockets = []; // TODO IMPORTANT refactor so that it is a list of Clients, not sockets
}

Room.prototype.join = function (socket) {
    this.sockets.push(socket);
    socket.join(this.name);

    if (this.sockets.length > 1) {
        // Log the successful match
        winston.info(
            chalk.bold.bgGreen.black(
                "Success! " +
                _.reduce(this.sockets, function(memo, sock) {
                    return memo + sock.handshake.sessionID + ", ";
                }, "") +
                " are matched!"
            ) + ""
        );
    }
};

Room.prototype.leave = function (socket) {
    if (this.sockets.indexOf(socket) === -1)
        return;
    try {
        socket.to(this.name).emit('my-error', {
            type: "other-disconnected",
            severity: "fatal"});
        socket.leave(this.name);
    } catch (err) {
        console.log("leave catch");
        // The socket is most likely not in this room
        // i.e. something has gone horribly wrong at some point
        // removes the socket from any room and TODO:20 deletes it
        _.each(socket.rooms, function(room) {
            socket.to(room).emit('my-error', 'Server-side socket error');
            // TODO:30 make sure that a dead socket can send a message to the rooms
            socket.leave(room);
            // TODO:50 make sure that removing elements from a list dunring
            // _.each doesn't do anything horribly wrong
        });
    }
};

Room.prototype.send = function (socket, message, type) {
    // TODO move this to Client prototype
    type = type || "chat message";
    try {
        socket.emit("chat message", message);
        socket.to(this.name).emit(type, message);
    } catch (err) {
        // The socket is most likely not in this room
        // don't do anything
    }
};

module.exports = Room;
