var DisplayChat = function() {
    //destrows the matchbox
    $('#loading-screen').fadeOut();

    // Finally, paints the chatbar at the bottom of the screen
    $('#chatrow').fadeIn();
    $('#chat-container').fadeIn();

    // Resizes the container dynamically to fit #chatrow
    $('#slide03').css("height", "94vh");

    // Scrolls to the bottom
    $('html, body').animate({
        scrollTop: $("#chatrow").offset().top
    }, 1000);
};

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
            msg.name = socket.name;
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

            // Decides if the message came from the sender or reciever
            if (color === "primary") {
                var elem = "<li class=\"self-message\"><span class=text-" + color + ">" + msg.name + "</span>: " + msg.text + "</li>";
            }
            else {
                var elem = "<li class=\"other-message\"><span class=text-" + color + ">" + msg.name + "</span>: " + msg.text + "</li>";
            }

            // Appends message
            $("#chat-messages").append(elem);

        });

        socket.on("name", function (msg) {
            console.log(msg);
            socket.name = msg;
        });
    };
    // for fast debug
    // FIXME remove this line before committing
    //window.initChat(userPreferences);
  })();
