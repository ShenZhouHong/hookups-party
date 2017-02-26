function DisplayChat() {
    // TODO find a way to make this impossible to call from the browser
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
}

function displayError (msg) {
    var html = '<div class="envelope error-box"><h2>Oh, fuck!</h2>'+ msg.text + '</div>';
    $('body').append(html);
    console.log("displayError");
    $("#send").addClass("disabled");
    $("#btn-input").attr("disabled", "");
    $("#chat-messages li").addClass("grayout");
    console.error(msg);
}

// Styles the chat bubbles to give them the correct borders
/*
    This is some shit-ass spaghetti code. Please forgive me. I will make it
    better later. It's so shit it is called every time a message is sent.
    Unforgivable.
*/
function StyleBubble(messageOwner) {
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
            var $this = $(this);
            var position = function () {
                var next_has_class_owner = $this.next().hasClass(messageOwner + '-message');
                var prev_has_class_owner = $this.prev().hasClass(messageOwner + '-message');
                var next_has_class_other = $this.next().hasClass(messageOther + '-message');
                var prev_has_class_other = $this.prev().hasClass(messageOther + '-message');

                // If the bubble is the first in the chat or the bubble is the first of its siblings, add the "top" class.
                if (
                    ($this.is(':first-child') && next_has_class_owner) ||
                    (prev_has_class_other && next_has_class_owner)
                )
                {
                    return "-top";
                }

                // If the bubble is in between its siblings then add the "med" class.
                if (
                    prev_has_class_owner && next_has_class_owner
                )
                {
                    return "-med";
                }

                // If the bubble is the last of its siblings or the bubble is the last in the chat, add the "low" class.
                if (
                    (prev_has_class_owner && next_has_class_other) ||
                    (prev_has_class_owner && ($this.is(':last-child')))
                )
                {
                    return "-low";
                }
                return "";
            } ();

            $this.addClass(messageOwner + "-message" + position);
    });
}
