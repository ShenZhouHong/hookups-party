var util = require('../generatenames')(); // required to generate names
var _ = require("underscore");
var xssFilters = require('xss-filters'); // required to sanitize input
var debug = require('debug')('chat');
/*
    Wraps a socket object nicely
*/
function Client (socket, waitingList) {
    this.socket = socket;
    var that = this;

    // this.socket.on('error', this.handleError);

    this.socket.on('disconnecting', function(msg) {
        that.disconnect();
    });

    this.socket.on('my-error', function(msg) {
        if (msg.severity === 'fatal') {
            that.disconnect();
        }
    });

    this.socket.on('chat message', function(msg) {
        msg.text = xssFilters.inHTMLData(msg.text);
        msg.name = that.name;
        that.room.send(that.socket, msg);
    });

    this.socket.on('remate', function(msg) {
        that.userPreferences = msg;  // TODO validate userPreferences
        waitingList.push(that);
        //console.log(waiting);
        var companion = waitingList.findMatch(that);
        // if there is no companion now, the sockets just gets added to
        if (companion !== undefined) {
            waitingList.mate(that, companion);
        }
    });
}


Client.prototype.mate = function (mate, room) {
    this.name = util.generateName();
    if (mate.name !== undefined) {
        while (this.name === mate.name) {
            this.name = util.generateName();
        }
    }
    debug("name: ", this.name);
    this.socket.emit("name", this.name);
    this.socket.emit("mate", mate.name);
    this.room = room;
    this.room.join(this.socket);
};

/*
    returns true if the preferences are compatible, false otherwise
*/
Client.prototype.comparePreferences = function (partner) {
    var first = this.userPreferences;
    var second = partner.userPreferences;
    var romance, gender, activity;
    gender = (first.partnerGender === second.selfGender ||
               first.partnerGender === "any") &&
              (second.partnerGender === first.selfGender ||
               second.partnerGender === "any");
    romance = (first.romance === second.romance);
    activity = (_.intersection(first.activities, second.activities).length);
    return (romance && gender && activity );
    //return _.isEqual(t, second);
};

/*
    Leaves the room the socket is in, if any.
    Do not call this function directly. Instead, use Client.socket.disconnect,
    that would in turn fire a 'disconnect' event, that would be handled by
    this function.
    TODO otherwise makes sure to remove the socket from the WaitingList, if any
*/
Client.prototype.disconnect = function () {
    if (this.room) {
        this.room.leave(this.socket);
        this.room = undefined; // so that there is no call stack
    }
    if (this.quitWaitingList) {
        this.quitWaitingList();
        this.quitWaitingList = undefined;
    }
};

module.exports = Client;
