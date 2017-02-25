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
var StyleBubble = function() {
    // for each self message on the page
    $( "li.self-message" ).each(function() {
        // If the bubble is the first in the chat
        if ($(this).is(':first-child') && $(this).next().hasClass('self-message')){
            $(this).addClass('self-message-top');
        }
        // If the bubble is the first of it's siblings
        else if ($(this).prev().hasClass('other-message') && $(this).next().hasClass('self-message')){
            $(this).addClass('self-message-top');
        }
        // If the bubble is in between it's siblings
        else if ($(this).prev().hasClass('self-message') && $(this).next().hasClass('self-message')){
            $(this).addClass('self-message-med');
        }
        // If the bubble is the last of it's siblings
        else if ($(this).prev().hasClass('self-message') && $(this).next().hasClass('other-message')){
            $(this).addClass('self-message-low');
        }
        // If the bubble is the last in the chat
        else if ($(this).prev().hasClass('self-message') && $(this).is(':last-child')){
            $(this).addClass('self-message-low');
        }
    });

    // for each other message on the page
    $( "li.other-message" ).each(function() {
        // If the bubble is the first in the chat
        if ($(this).is(':first-child') && $(this).next().hasClass('other-message')){
            $(this).addClass('other-message-top');
        }
        // If the bubble is the first of it's siblings
        else if ($(this).prev().hasClass('self-message') && $(this).next().hasClass('other-message')){
            $(this).addClass('other-message-top');
        }
        // If the bubble is in between it's siblings
        else if ($(this).prev().hasClass('other-message') && $(this).next().hasClass('other-message')){
            $(this).addClass('other-message-med');
        }
        // If the bubble is the last of it's siblings
        else if ($(this).prev().hasClass('other-message') && $(this).next().hasClass('self-message')){
            $(this).addClass('other-message-low');
        }
        // If the bubble is the last in the chat
        else if ($(this).prev().hasClass('other-message') && $(this).is(':last-child')){
            $(this).addClass('other-message-low');
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
                var elem = "<li class=\"self-message\"><span class=text-" + color + ">" + msg.name + "</span>: " + msg.text + "</li>";
            }
            else {
                var elem = "<li class=\"other-message\"><span class=text-" + color + ">" + msg.name + "</span>: " + msg.text + "</li>";
            }

            // Appends message
            $("#chat-messages").append(elem);
            StyleBubble();

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
