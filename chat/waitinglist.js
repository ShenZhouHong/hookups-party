var _ = require("underscore");
function WaitingList (roomHandler) {
    this.roomHandler = roomHandler || new RoomHandler();
    this.waiting = [];
}

/*
    returns, if exists, a socket from the waiting list which has a
    "userPreferences" object matching the one given
    such a socket is always the longest-waiting one (lower in the list)
    DOES NOT DELETE THE ELEMETS FROM THE LIST
*/
WaitingList.prototype.findMatch = function (client) {
    var companion;
    // "waiting" is a LIFO, so the person that gets selected is the one that
    // has waited the most
    for (var i = 0; i < this.waiting.length; i++) {
        var cur = this.waiting[i];
        if (cur === client) continue;
        if (client.comparePreferences(cur)) {
            companion = cur;
                break;
            }
    }
    return companion;
};

/*
    self-explanatory: just adds the socket and its preferences to the
    "waiting" list
*/
WaitingList.prototype.push = function (client) {
    // TODO make sure the socket is not already waiting
    this.waiting.push(client);
};

/*
    Takes care of everything necessary to let these sockets chat between them
    i.e. generates names, sets names, emits names, removes sockets from
    waiting list, creates a room and makes the sockets join the room
*/
WaitingList.prototype.mate = function (first, second) {
    var room = this.roomHandler.newRoom();
    first.mate(second, room);
    second.mate(first, room);

    this.waiting = _.filter(this.waiting, function(cur) {
        return cur.socket != first && cur.socket != second;
    });
};

module.exports = WaitingList;
