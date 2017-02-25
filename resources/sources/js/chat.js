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
        msg.name = socket.name;
        sendMessage(socket, msg);
        $(".input-sm").val('');
        return false;
    });

    socket.on('mate', function(msg) {
        DisplayChat();
    });

    socket.on('my-error', function(msg) {
        // NOt yet implemented
        if (msg.severity === "fatal") {
            socket.emit('disconnect');
        }
        if (msg.type === "other-disconnected") {
            msg.text = "Your virtual date has disconnected!";
        }
        displayError(msg);
    });

    socket.on('chat message', function(msg) {
        var color = msg.name === socket.name ? "primary" : "success";

        // Decides if the message came from the sender or reciever
        if (color === "primary") {
            messageOwner = "self"
            var elem = "<li class=\"self-message\" style=\" display: none; \"><span class=text-" + color + ">" + msg.name + "</span>: " + msg.text + "</li>";
        }
        else {
            messageOwner = "other"
            var elem = "<li class=\"other-message\" style=\" display: none; \"><span class=text-" + color + ">" + msg.name + "</span>: " + msg.text + "</li>";
        }

        // Appends message
        $("#chat-messages").append(elem);
        $("#chat-messages :last-child").show(100, function() {
            console.info("Trying to scroll to bottom now");
            // Scrolls to bottom after done animating
            $('#chat-container').scrollTop($('#chat-container')[0].scrollHeight - $('#chat-container')[0].clientHeight);
            StyleBubble(messageOwner);

        });

    });

    socket.on("name", function (msg) {
        console.log(msg);
        socket.name = msg;
    });
};
// for fast debug
// FIXME remove this line before committing
//window.initChat(userPreferences);
