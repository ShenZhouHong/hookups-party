var _ = require("underscore");
var RoomFactory = require('./roomfactory');
var winston = require('winston');

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
    if (companion !== undefined) {
        winston.debug("companion");
        this.mate(client, companion);
    }
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

    /* Template messages */
    var greetingMsgTemplate = _.template("Congratulations, we've found you a match! Your anonymous <i>sexy</i> username is <b><%= self_name %></b> and you are now chatting with <b><%= name %></b>!");
    var activityMsgTemplate = _.template("Both of you have agreed to <strong><%= activity %></strong> ~ why don't you hook up? 😉👄👅💦 Remember - once you leave this chat room, <i>you may never meet this person again</i>!");

    /*
        Constructs messages from template with correct SexyNames and pronouns
    */
    // Formats activity array into user-readable text
    var activities = _.map(
            _.intersection(first.userPreferences.activities, second.userPreferences.activities),
            function(id) {
                return id.replace('_', ' ');
            }
        ).join(', ');

    // Creates greeting message for the first user
    var firstGreetingMsg = {
        text: greetingMsgTemplate({
            name: first.name,
            self_name: second.name,
        }),
        name: second.name,
        type: 1
    };

    // Creates greeting message for the second user
    var secondGreetingMsg = {
        text: greetingMsgTemplate({
            name: second.name,
            self_name: first.name,
        }),
        name: first.name,
        type: 1
    };

    // Creates activity message for both users
    var ActivityMsg = {
        text: activityMsgTemplate({
            activity: activities,
        }),
        type: 1
    };

    // Sends messages off to both parties when they match
    first.socket.emit("server message", firstGreetingMsg);
    first.socket.emit("server message", ActivityMsg);
    second.socket.emit("server message", secondGreetingMsg);
    second.socket.emit("server message", ActivityMsg);

    var l = this.waiting.length;
    this.waiting = _.filter(this.waiting, function(cur) {
        return cur.socket !== first.socket && cur.socket !== second.socket;
    });
    if (this.waiting.length === l) {
        winston.error("FUCKING WAITING LIST");
    } else {
        // winston.info("GOOD");
    }
};

module.exports = WaitingList;
