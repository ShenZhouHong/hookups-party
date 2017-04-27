function sendMessage(socket, msg) {
    socket.emit('chat message', msg);
}

window.initChat = function(userPreferences) {
    var socket = io();
    socket.emit("login");
    // tell the server I want a match with these preferences
    console.log(userPreferences);
    socket.emit("remate", userPreferences);

    // When the message form is submit, collect the text and send it
    $("#send-form").submit(function () {
        var msg = {};
        var rawInput = $('.input-sm').val();

        // Basic sanity check against empty or zero-length messages
        if ((rawInput.length === 0) || (/^\s*$/.test(rawInput))) {
            // console.info("Message size is zero. Discarding");
        }
        else {
            msg.text = $('.input-sm').val();
            msg.name = socket.name;
            sendMessage(socket, msg);
        }

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
        if (msg.severity === "fatal") {
            socket.disconnect();
        }
        if (msg.type === "other-disconnected") {
            var result = {};
            result.title = "They're Gone!";
            result.text = "Looks like your partner has disconnected. Did the conversation go well? Have you set up a time to meet? 😉";
            displayError(result);  // shows a letterbox with the error
        } else if (msg.type === "already-connected") {
            window.location.replace("/session");
        }
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
