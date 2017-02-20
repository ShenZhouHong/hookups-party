var adjectives, animals;
var _ = require("underscore");
var xssFilters = require('xss-filters');

function loadNames() {
    var animals = [],
        adjectives = [];
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(__dirname + '/resources/adjectives')
    });

    lineReader.on('line', function(line) {
        adjectives.push(line);
    });

    lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(__dirname + '/resources/animals')
    });

    lineReader.on('line', function(line) {
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
    var waiting = []; // TODO change this to a better data structure
    var roomNames = new Set();
    module.adjectives = t[0];
    module.animals = t[1];

    /*
        returns a new unique room name
        (distinct from any other *currently* existing room name: old and
        deleted names can be reused)
        automatically adds the reeturned name to the used names
    */
    function generateRoomName() {
        var roomName = module.generateName(module.adjectives, module.animals);
        while (roomNames.has(roomName)) {
            roomName = module.generateName(module.adjectives, module.animals);
        }
        roomNames.add(roomName);
        return roomName;
    }

    /*
        Takes care of everything necessary to let these sockets chat between them
        i.e. generates names, sets names, emits names, removes sockets from
        waiting list, creates a room and makes the sockets join the room
    */
    function mate(first, second) {
        var room = generateRoomName();
        first.name = module.generateName(module.adjectives, module.animals);
        second.name = module.generateName(module.adjectives, module.animals);
        while (second.name === first.name)
            second.name = module.generateName(module.adjectives, module.animals);
        first.emit("name", first.name);
        second.emit("name", second.name);
        first.emit("mate", second.name);
        second.emit("mate", first.name);
        first.join(room);
        second.join(room);
        var flag1 = false,
            flag2 = false;
        var firsti, secondi;
        for (var i = 0; i < waiting.length && !flag1 && !flag2; i++) {
            if (waiting[i].socket === first) {
                firsti = i;
                flag1 = true;
            } else if (waiting[i].socket === second) {
                secondi = i;
                flag2 = true;
            }
        }
        // TODO check, this might not actually work
        if (firsti !== undefined)
            waiting.splice(firsti, 1);
        if (secondi !== undefined)
            waiting.splice(secondi, 1);
    }

    /*
        self-explanatory: just adds the socket and its preferences to the
        "waiting" list
    */
    function addToWaitingRoom(socket, userPreferences) {
        // TODO make sure the socket is not already waiting
        var obj = {
            socket: socket,
            userPreferences: userPreferences
        };
        waiting.push(obj);
    }

    /*
        returns true if the preferences are compatible, false otherwise
    */
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

    /*
        returns, if exists, a socket from the waiting list which has a
        "userPreferences" object matching the one given
        such a socket is always the longest-waiting one (lower in the list)
        DOES NOT DELETE THE ELEMETS FROM THE LIST
    */
    function findMatch(socket, userPreferences) {
        var companion;
        // "waiting" is a LIFO, so the person that gets selected is the one that
        // has waited the most
        for (var i = 0; i < waiting.length; i++) {
            var cur = waiting[i];
            if (cur.socket === socket) continue;
            if (comparePreferences(userPreferences, cur.userPreferences)) {
                companion = cur.socket;
                break;
            }
        }
        return companion;
    }

    /*
        leaves all the rooms the socket is in
    */
    function leaveRoom(socket) {
        // TODO finish this
        for (var i = 0; i < socket.rooms.length; i++) {
            var room = socket.rooms[i];
            if (room !== socket.id)
                socket.leave(room);
        }
    }

    io.on('connection', function(socket) {
        socket.on('disconnect', function(msg) {
            // TODO handle disconnection code
        });

        socket.on('chat message', function(msg) {
            msg.text = xssFilters.inHTMLData(msg.text);
            msg.name = socket.name;
            sendMessage(socket, msg);
        });
        socket.on('remate', function(msg) {
            leaveRoom(socket);
            addToWaitingRoom(socket, msg);
            //console.log(waiting);
            var companion = findMatch(socket, msg);
            // if there is no companion now, the sockets just gets added to
            if (companion !== undefined)
                mate(socket, companion);
        });
    });

    /*
        adjectives, animals arguments are arrays of strings
        returns a String of the form AdjectiveAnimal
    */
    module.generateName = function(adjectives, animals) {
        var first_adjective, second_adjective, animal;
        var rand;
        first_adjective =
            adjectives[Math.floor(Math.random() * adjectives.length)];
        second_adjective =
            adjectives[Math.floor(Math.random() * adjectives.length)];
        animal = animals[Math.floor(Math.random() * adjectives.length)];

        first_adjective =
            first_adjective[0].toUpperCase() + first_adjective.slice(1);
        second_adjective =
            second_adjective[0].toUpperCase() + second_adjective.slice(1);
        animal = animal[0].toUpperCase() + animal.slice(1);

        return first_adjective + animal;
    };
    return module;
};