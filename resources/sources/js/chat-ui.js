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
};

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
