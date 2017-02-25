var util = require('../generatenames')();
var Room = require('./room');
var _ = require('underscore');

/*
    Creates unique-named rooms and stores them
*/
function RoomFactory () {
    this.roomNames = new Set();
    this.rooms = [];
}

/*
    returns a new unique-named room object
    (distinct from any other *currently* existing room name: old and
    deleted names can be reused)
    automatically adds the returned room to the room list
*/
RoomFactory.prototype.newRoom = function () {
    var roomName = util.generateName();
    while (this.hasRoom(roomName)) {
        roomName = util.generateName();
    }
    var room = new Room(roomName);
    this.rooms.push(room);
    return room;
};

/*
    Returns true if there exist a room with the given name (supposed to be
    unique), false otherwise.
*/
RoomFactory.prototype.hasRoom = function (roomName) {
    return _.any(this.rooms, function (room) {
        return room.name === roomName;
    });
};

module.exports = RoomFactory;
