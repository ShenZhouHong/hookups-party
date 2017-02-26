function sendMessage(socket, msg) {
    socket.emit('chat message', msg);
}

window.initChat = function(userPreferences) {
    var socket = io();
    socket.emit("login");
    // tell the server I want a match with these preferences
    socket.emit("remate", userPreferences);

    // When the message form is submit, collect the text and send it
    $("#send-form").submit(function () {
        var msg = {};
        msg.text = $('.input-sm').val();
        msg.name = socket.name;
        sendMessage(socket, msg);
        $(".input-sm").val('');
        return false;
    });

    // When the server reports that a match is found, display the chat UI
    socket.on('mate', function(msg) {
        DisplayChat();
    });

    // Aparently not self-explanatory
    // Something bad happened server-side, but the event 'error' is reserved
    // by socketio, so I use 'my-error' instead.
    // There should be a complex switch case once many msg types are created,
    // but for now the only possible error is 'other-disconnected'
    socket.on('my-error', function(msg) {
        // NOt yet implemented
        if (msg.severity === "fatal") {
            socket.disconnect();
        }
        if (msg.type === "other-disconnected") {
            msg.text = "Your virtual date has disconnected!";
        }
        displayError(msg);  // shows a letterbox with the error
    });

    // A message is received
    socket.on('chat message', function(msg) {
        // Decides if the message came from the sender or reciever
        var messageOwner = msg.name === socket.name ? "self" : "other";
        var elem = '<li class="' + messageOwner + '-message" style=" display: none; ">' + msg.text + "</li>";

        // Appends message
        $("#chat-messages").append(elem);
        StyleBubble(messageOwner);
        $("#chat-messages :last-child").show(100, function() {
            console.info("Trying to scroll to bottom now");
            // Scrolls to bottom after done animating
            $('#chat-container').scrollTop($('#chat-container')[0].scrollHeight - $('#chat-container')[0].clientHeight);
        });

    });

    // Server determined name. Not displayed currently, but used as a unique ID
    socket.on("name", function (msg) {
        socket.name = msg;
    });
};
// for fast debug
// FIXME remove this line before committing
//window.initChat(userPreferences);
