var util = require('../generatenames')();

function RoomFactory () {
    this.roomNames = new Set();
}

/*
    returns a new unique room name
    (distinct from any other *currently* existing room name: old and
    deleted names can be reused)
    automatically adds the reeturned name to the used names
*/
RoomFactory.prototype.newRoom = function () {
    var roomName = util.generateName();
    while (this.hasRoom(roomName)) {
        roomName = util.generateName();
    }
    this.roomNames.add(roomName);
    return roomName;
};

RoomFactory.prototype.hasRoom = function (roomName) {
    return this.roomNames.has(roomName);
};

module.exports = RoomFactory;
