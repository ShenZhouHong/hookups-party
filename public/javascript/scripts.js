/*
    Global user preferences object. Values are defined and updated as the
    user completes the prompts. Eventually gets sent to server on submit.

    Possible values:
        selfGender:    'male' | 'female' | 'other'  | undefined
        romance:       true   | false    | undefined
        partnerGender: 'male' | 'female' | 'both'   | undefined
        activities: [
                       'make out', 'eat', 'fuck'
    ]

    The 'activities' key contains an array that is empty by default, and
    populated by a list of activities that the user has choosen.
*/
var userPreferences = {
    selfGender: undefined,
    romance: undefined,
    partnerGender: undefined,
    activities: []
};

/*
    Generic button toggler. Implements radio buttion functionality on a group
    of buttons with a shared class (the 'group' argument).
*/
var toggleButton = function(element, group, event) {
    // Prevents link from being followed if button is an <a>
    event.preventDefault();

    // Removes previously from the entire group
    if (($(group)).hasClass('active')) {
        $(group).removeClass('active');
        $(group).removeClass('btn-primary');
    }

    // Activates the clicked element
    $(element).addClass('active');
    $(element).addClass('btn-primary');
};

/*
    Generic array element toggler. Adds an element to an array. However, if the
    array already has that element, the element is removed. WARNING: Only does
    this for the first instance of that element!
*/
function addOrRemove(array, value) {
    var index = array.indexOf(value);

    if (index === -1) {
        array.push(value);
    } else {
        array.splice(index, 1);
    }
}

/*
    Implements user gender prompt functionality. Scrolls down to the next page
    on first selection, otherwise assures the user their choice is upddated.
*/
$('.is-gender').on('click', function(event) {
    toggleButton($(this), '.is-gender', event);

    // Toggles the visibility of the next prompt
    $('#self-gender-comma').fadeIn();
    $("#romance-selection").fadeIn();

    // Finally, update userPreferences with the new values
    if (this.id == 'man') {
        userPreferences.selfGender = 'male';
    }
    if (this.id == 'woman') {
        userPreferences.selfGender = 'female';
    }
    if (this.id == 'other') {
        userPreferences.selfGender = 'other';
    }
});

/*
    Allows the user to choose for the theme of their adventure. Either romance
    or just some fun.
*/
$('.is-looking-for').on('click', function(event) {
    toggleButton($(this), '.is-looking-for', event);

    // Toggles the visibility of the next prompt
    $("#slide02").fadeIn();

    // Scrolls to the next prompt only once
    if (userPreferences.romance === undefined) {
        // Scrolls to the next prompt
        $('html, body').animate({
            scrollTop: $("#slide02").offset().top
        }, 1000);
    }

    // Finally, update userPreferences with the new values
    if (this.id == 'romance') {
        userPreferences.romance = true;
    }
    if (this.id == 'some-fun') {
        userPreferences.romance = false;
    }
});

/*
    Implements partner gender functionality. Displays the following prompt on
    first selection, otherwise throws an reassuring alert for the user
*/
$('.want-gender').on('click', function(event) {
    toggleButton($(this), '.want-gender', event);

    // Displays the next prompt using FadeToggle (will run only once)
    $('#want-gender-comma').fadeIn(); // Makes grammatical sentence :P
    $('#sexual-preference').fadeIn();

    // Finally, update userPreferences with the new values
    if (this.id == 'male') {
        userPreferences.partnerGender = 'male';
    }
    if (this.id == 'female') {
        userPreferences.partnerGender = 'female';
    }
    if (this.id == 'any') {
        userPreferences.partnerGender = 'any';
    }

    // Make sentence grammatically correct, because I'm pedentic
    if (userPreferences.partnerGender == "any") {
        $('#want-gender-a').css("visibility", "hidden");
    } else {
        $('#want-gender-a').css("visibility", "visible");
    }

    // If any buttons are pressed here, previous buttons will be disabled
    $('.is-gender').addClass('disabled');
    $('.is-looking-for').addClass('disabled');

});

/*
    Finally, implements the sex act selection functionality. Note that sex acts
    are not mutually exclusive, therefore function is different from the others!
*/
$('.activity').on('click', function(event) {

    // Displays hint that multiple sexual activities can be choosen
    $('#more-activities-hint').fadeIn();

    // Fades in the search prompt after a short delay
    $('#search-prompt').delay(1100).fadeIn();


    /*
        Since sexual activities are not multually exclusive, checkbox-styled
        functionality is implemented here for the buttons.
    */
    event.preventDefault();
    if (($(this)).hasClass('active')) {
        $(this).removeClass('active');
        $(this).removeClass('btn-warning');
    } else {
        $(this).addClass('active');
        $(this).addClass('btn-warning');
    }

    /*
        Updates userPreferences with new values for sex acts. Performs a check
        on each button press, hence long if/else block.
    */
    // Making out
    if (this.id == 'make_out' && ($(this)).hasClass('active')) {
        addOrRemove(userPreferences.activities, "make_out");
    } else if (this.id == 'make_out' && !($(this)).hasClass('active')) {
        addOrRemove(userPreferences.activities, "make_out");
    }

    // Eating out
    if (this.id == 'eat' && ($(this)).hasClass('active')) {
        addOrRemove(userPreferences.activities, "eat");
    } else if (this.id == 'eat' && !($(this)).hasClass('active')) {
        addOrRemove(userPreferences.activities, "eat");
    }

    // Fucking
    if (this.id == 'fuck' && ($(this)).hasClass('active')) {
        addOrRemove(userPreferences.activities, "fuck");
    } else if (this.id == 'fuck' && !($(this)).hasClass('active')) {
        addOrRemove(userPreferences.activities, "fuck");
    }

    /*
        If there are no sexual activities chosen, the search button is disabled,
        and the user is prompted by a hint
    */
    if (!$('.activity').hasClass('active')) {
        $('#search-button').addClass('disabled');
        $('#missing-activity-hint').fadeIn();
    } else {
        $('#search-button').removeClass('disabled');
        $('#missing-activity-hint').fadeOut();
    }
});

/* When the search button is pressed */
$('#search-button').on('click', function(event) {
    // Disables all buttons above
    $('.want-gender').addClass('disabled');
    $('.activity').addClass('disabled');

    // Reveals the loading slide
    $('#slide03').fadeIn();

    // Scrolls to the loading slide
    $('html, body').animate({
        scrollTop: $("#slide03").offset().top
    }, 1000);

    // Destroys all slides above
    $('#slide01').delay(600).fadeOut();
    $('#slide02').delay(600).fadeOut();

    // Slowly eases in the loading messages
    $('#loading02').delay(1000).fadeIn();
    $('#loading03').delay(1600).fadeIn();
    $('#loading04').delay(2200).fadeIn();

    // Sends the user preferences over
    initChat(userPreferences);
});

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
