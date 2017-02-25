var adjectives, animals;
var _ = require("underscore");
var xssFilters = require('xss-filters');
var util = require('./util');

module.exports = function(app) {
    var module = {};
    var io = require('socket.io')(app);
    var waiting = new WaitingList(); // TODO change this to a better data structure
    var roomNames = new Set();
    var clients = [];
    var t = util.loadNames();
    module.adjectives = t[0];
    module.animals = t[1];

    function WaitingList () {
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
        var room = generateRoomName();
        first.mate(second, room);
        second.mate(first, room);

        waiting = _.filter(waiting, function(cur) {
            return cur.socket != first && cur.socket != second;
        });
    };

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
        this.name = util.generateName(module.adjectives, module.animals);
        if (mate.name !== undefined) {
            while (this.name === mate.name) {
                this.name = util.generateName(module.adjectives, module.animals);
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

    io.on('connection', function(socket) {
        console.log("socket connected");
        var client = new Client(socket, waiting);
        clients.push(client);
    });

    /*
        returns a new unique room name
        (distinct from any other *currently* existing room name: old and
        deleted names can be reused)
        automatically adds the reeturned name to the used names
    */
    function generateRoomName() {
        var roomName = util.generateName(module.adjectives, module.animals);
        while (roomNames.has(roomName)) {
            roomName = util.generateName(module.adjectives, module.animals);
        }
        roomNames.add(roomName);
        return roomName;
    }
    return module;
};
