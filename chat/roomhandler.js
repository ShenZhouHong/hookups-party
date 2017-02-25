var util = require('../util')();

function RoomHandler () {
    this.roomNames = new Set();
}

/*
    returns a new unique room name
    (distinct from any other *currently* existing room name: old and
    deleted names can be reused)
    automatically adds the reeturned name to the used names
*/
RoomHandler.prototype.newRoom = function () {
    var roomName = util.generateName();
    while (this.hasRoom(roomName)) {
        roomName = util.generateName();
    }
    this.roomNames.add(roomName);
    return roomName;
};

RoomHandler.prototype.hasRoom = function (roomName) {
    return this.roomNames.has(roomName);
};

module.exports = RoomHandler;
