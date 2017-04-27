var _ = require("underscore");
var RoomFactory = require('./roomfactory');

function WaitingList (roomFactory) {
    this.roomFactory = roomFactory || new RoomFactory();
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
    Adds the sockets to the 'waiting' list, giving the socket a callback
    in case the sockets disconnects before finding a match
*/
WaitingList.prototype.push = function (client) {
    if (_.any(this.waiting, function (curClient) {
        return (curClient !== client); })) {
            // if the socket is already waiting
            return;
    }
    this.waiting.push(client);
    var that = this;
    client.quitWaitingList = function () {
        that.remove(this);
    };
};

WaitingList.prototype.remove = function (client) {
    this.waiting = _.filter(this.waiting, function (curClient) {
        return (curClient !== client);
    });
};

/*
    Takes care of everything necessary to let these sockets chat between them
    i.e. generates names, sets names, emits names, removes sockets from
    waiting list, creates a room and makes the sockets join the room
*/
WaitingList.prototype.mate = function (first, second) {
    var room = this.roomFactory.newRoom();
    first.mate(second, room);
    second.mate(first, room);
    var msgTemplate = _.template("We've found you a match! You are now chatting with <%= name %>! <%= pronoun %> also wants to <strong><%= activity %></strong>!");
    var activities = _.map(
            _.intersection(first.userPreferences.activities, second.userPreferences.activities), 
            function(id) {
                return id.replace('_', ' ');
            }
        ).join(', ');
    var firstMsg = {
        text: msgTemplate({
            name: first.name,
            pronoun: first.userPreferences.selfGender === "male" ? "He" : (first.userPreferences.selfGender === "female" ? "She" : "They"),
            activity: activities
        }),
        name: second.name,
        type: 1
    };
    var secondMsg = {
        text: msgTemplate({
            name: second.name,
            pronoun: second.userPreferences.selfGender === "male" ? "He" : (second.userPreferences.selfGender === "female" ? "She" : "They"),
            activity: activities
        }),
        name: first.name,
        type: 1
    };
    console.log(firstMsg);
    console.log(secondMsg);
    first.socket.emit("chat message", firstMsg);
    second.socket.emit("chat message", secondMsg);

    this.waiting = _.filter(this.waiting, function(cur) {
        return cur.socket != first && cur.socket != second;
    });
};

module.exports = WaitingList;
