var util = require('../util')(); // required to generate names
var _ = require("underscore");
var xssFilters = require('xss-filters'); // required to sanitize input
/*
    Wraps a socket object nicely
*/
function Client (socket, waitingList) {
    this.socket = socket;
    var that = this;
    this.socket.on('disconnect', function(msg) {
        // TODO handle disconnection code
    });
    this.socket.on('chat message', function(msg) {
        msg.text = xssFilters.inHTMLData(msg.text);
        msg.name = that.name;
        that.sendMessage(msg);
    });
    this.socket.on('remate', function(msg) {
        that.leaveRoom();
        that.userPreferences = msg;
        waitingList.push(that);
        //console.log(waiting);
        var companion = waitingList.findMatch(that);
        // if there is no companion now, the sockets just gets added to
        if (companion !== undefined) {
            waitingList.mate(that, companion);
        }
    });
}

/*
    leaves all the rooms the socket is in
*/
Client.prototype.leaveRoom = function () {
    // TODO finish this
    for (var i = 0; i < this.socket.rooms.length; i++) {
        var room = this.socket.rooms[i];
        if (room !== this.socket.id)
            this.socket.leave(room);
    }
};

Client.prototype.mate = function (mate, room) {
    this.name = util.generateName();
    if (mate.name !== undefined) {
        while (this.name === mate.name) {
            this.name = util.generateName();
        }
    }
    console.log("name: ", this.name);
    this.socket.emit("name", this.name);
    this.socket.emit("mate", mate.name);
    this.socket.join(room);

};


Client.prototype.sendMessage = function (msg) {
    this.socket.emit("chat message", msg);
    console.log("msg: ", msg);
    for (var room in this.socket.rooms) {
        this.socket.to(room).emit("chat message", msg);
    }
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
               second.partnerGender === any);
    romance = (first.romance === second.romance);
    activity = (_.intersection(first.activities, second.activities).length);
    return (romance && gender && activity );
    //return _.isEqual(t, second);
};

module.exports = Client;
