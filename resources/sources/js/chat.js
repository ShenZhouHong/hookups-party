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

// Styles the chat bubbles to give them the correct borders
/*
    This is some shit-ass spaghetti code. Please forgive me. I will make it
    better later. It's so shit it is called every time a message is sent.
    Unforgivable.
*/
var StyleBubble = function(messageOwner) {
    // Makes sure the other message property is set
    if (messageOwner == "self") {
        messageOther = "other";
    }
    else if (messageOwner == "other") {
        messageOther = "self";
    }

    // for each self message on the page
    var selector =  "li." + messageOwner + "-message";
    $(selector + ":last-of-type, " + selector + ":nth-last-of-type(2)")
        .each(function() {

        // If the bubble is the first in the chat
        if ($(this).is(':first-child') && $(this).next().hasClass(messageOwner + '-message')){
            $(this).addClass(messageOwner + '-message-top');
        }
        // If the bubble is the first of it's siblings
        else if ($(this).prev().hasClass(messageOther + '-message') && $(this).next().hasClass(messageOwner + '-message')){
            $(this).addClass(messageOwner + '-message-top');
        }
        // If the bubble is in between it's siblings
        else if ($(this).prev().hasClass(messageOwner + '-message') && $(this).next().hasClass(messageOwner + '-message')){
            $(this).addClass(messageOwner + '-message-med');
        }
        // If the bubble is the last of it's siblings
        else if ($(this).prev().hasClass(messageOwner + '-message') && $(this).next().hasClass(messageOther + '-message')){
            $(this).addClass(messageOwner + '-message-low');
        }
        // If the bubble is the last in the chat
        else if ($(this).prev().hasClass(messageOwner + '-message') && $(this).is(':last-child')){
            $(this).addClass(messageOwner + '-message-low');
        }
    });
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

    function displayError (msg) {
        alert("There has been an error:" + msg.type);
        console.log(msg);
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
})();
