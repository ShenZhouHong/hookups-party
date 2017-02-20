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

    $("#send-form").submit(function () {
        var msg = {};
        msg.text = $('.input-sm').val();
        sendMessage(socket, msg);
        $(".input-sm").val('');
        return false;
    });
    var socket = io();
    socket.emit("login");
    socket.emit("remate", userPreferences);

    socket.on('chat message', function(msg) {
        console.log(msg);
        console.log(socket.name);
        var color = msg.name === socket.name ? "primary" : "success";
        var elem = "<li><span class=text-" + color + ">" + msg.name + "</span>: " + msg.text + "</li>";
        $("#chat-messages").append(elem);
    });

    socket.on("name", function (msg) {
        socket.name = msg;
    });

  })();
