var adjectives, animals;
var _ = require("underscore");

function loadNames() {
    var animals = [], adjectives = [];
    var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/resources/adjectives')
    });

    lineReader.on('line', function (line) {
      adjectives.push(line);
    });

    lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/resources/animals')
    });

    lineReader.on('line', function (line) {
      animals.push(line);
    });
    return [adjectives, animals];
}

function sendMessage(socket, msg) {
    console.log(socket.rooms);
    socket.emit("chat message", msg);
    for (var room in socket.rooms) {
        socket.to(room).emit("chat message", msg);
    }
}

module.exports = function(app) {
    var module = {};
    var io = require('socket.io')(app);
    var t = loadNames();
    var waiting = [];  // TODO change this to a better data structure
    module.adjectives = t[0];
    module.animals = t[1];

    function generateRoomName () {
        // TODO implement edge case hash checking
        return module.generateName();
    }

    /*
        Takes care of everything necessary to let these sockets chat between them
    */
    function mate(first, second) {
        console.log("mate");
        var room = generateRoomName();
        first.name = module.generateName();
        second.name = module.generateName();
        while(second.name === first.name)
            second.name = module.generateName();
        first.emit("name", first.name);
        second.emit("name", second.name);
        first.join(room);
        second.join(room);
    }

    function addToWaitingRoom(socket, userPreferences) {
        console.log("addToWaitingRoom");
        // TODO make sure the socket is not already waiting
        var obj = {
            socket: socket,
            userPreferences: userPreferences
        };
        waiting.push(obj);
    }

    function comparePreferences(first, second) {
        var t = first;
        var temp;
        //temp = t.selfGender;
        //t.selfGender = t.partnerGender;
        //t.partnerGender = temp;
        //console.log("first", first);
        //console.log("second", second);
        //console.log("t", t);
        return _.isEqual(t, second);

        //return first.romance === second.romance &&
            //first.selfGender === second.partnerGender &&
            //second.selfGender === first.partnerGender &&
            //first.activities ===

    }

    function findMatch(socket, userPreferences) {
        console.log("findMatch");
        var companion;
        var socketIndex;
        var lastVisitedIndex = 0;
        // "waiting" is a LIFO, so the person that gets selected is the one that
        // has waited the most
        console.log(waiting.length);
        for (var i = 0; i < waiting.length; i++) {
            var cur = waiting[i];
            if (cur.socket === socket) {
                socketIndex = i;
                continue;
            }
            if (comparePreferences(userPreferences, cur.userPreferences)) {
                console.log("found userPreferences match");
                companion = cur.socket;
                lastVisitedIndex = i;
            }
        }
        if (companion !== undefined) {
            if (socketIndex !== undefined) {
                waiting.splice(socketIndex, 1);
            } else {
                for (var j = 0; j < waiting.length; j++) {
                    if (waiting[j].socket === socket) {
                        waiting.splice(j, 1);
                        break;
                    }
                }
            }
        }
        return companion;
    }

    function leaveRoom(socket) {
        // TODO finish this
        for (var i = 0; i < socket.rooms.length; i++){
            var room = socket.rooms[i];
            if (room !== socket.id)
                socket.leave(room);
        }
    }

    io.on('connection', function(socket){
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('chat message', function(msg){
            console.log("msg", msg)
            msg.name = socket.name;
            sendMessage(socket, msg);
        });
        socket.on('remate', function(msg){
            leaveRoom(socket);
            addToWaitingRoom(socket, msg);
            //console.log(waiting);
            var companion = findMatch(socket, msg);
            // if there is no companion now, the sockets just gets added to
            if (companion)
                mate(socket, companion);
        });
    });

    module.generateName = function(){
        var adjectives = module.adjectives;
        var animals = module.animals;
        var first_adjective, second_adjective, animal;
        var rand;
        first_adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        second_adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        animal = animals[Math.floor(Math.random() * adjectives.length)];

        first_adjective = first_adjective.charAt(0).toUpperCase() + first_adjective.slice(1);
        second_adjective = second_adjective.charAt(0).toUpperCase() + second_adjective.slice(1);
        animal = animal.charAt(0).toUpperCase() + animal.slice(1);

        return first_adjective + animal;
    };
    return module;
};
