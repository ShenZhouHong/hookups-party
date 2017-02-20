(function () {
    var userPreferences = {
        selfGender: "male",
        romance: true,
        partnerGender: "female",
        activities: ["make out", "fuck"]
    };

    function sendMessage(socket, msg) {
        socket.emit('chat message', msg);
    }


    window.initChat = function(userPreferences) {
        var socket = io();
        socket.emit("login");
        socket.emit("remate", userPreferences);

        $("#send-form").submit(function () {
            var msg = {};
            msg.text = $('.input-sm').val();
            sendMessage(socket, msg);
            $(".input-sm").val('');
            return false;
        });

        socket.on('mate', function(msg) {
            DisplayChat();
        });

        socket.on('error', function(msg) {
            // NOt yet implemented
            displayError(msg);
        });

        socket.on('chat message', function(msg) {
            var color = msg.name === socket.name ? "primary" : "success";
            var elem = "<li><span class=text-" + color + ">" + msg.name + "</span>: " + msg.text + "</li>";
            $("#chat-messages").append(elem);
        });

        socket.on("name", function (msg) {
            socket.name = msg;
        });
    };
  })();
