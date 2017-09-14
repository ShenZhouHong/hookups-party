/*
    Global user preferences object. Values are defined and updated as the
    user completes the prompts. Eventually gets sent to server on submit.

    Possible values:
        selfGender:    'male' | 'female' | 'other'  | undefined
        romance:       true   | false    | undefined
        partnerGender: 'male' | 'female' | 'both'   | undefined
        activities: [
                       'cuddle', 'make out', 'eat', 'fuck'
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
    Notification function wrapper
*/
var PushNotification = function(title, message, icon) {
    if (!Notification) {
        console.info('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: icon,
            body: message,
        });

        notification.onclick = function () {
            window.focus();
            this.cancel();
        };
    }
};

/* Makes sure that the DOM is only manipulated when ready */
$(function () {
    "use strict";

    console.log( "ready!" );

    /*
        Asks for permission to display notifications using the notification Attempting
    */
    document.addEventListener('DOMContentLoaded', function () {
        if (Notification.permission !== "granted")
        Notification.requestPermission();
    });

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
        $("#romance-selection").css('visibility','visible').hide().fadeIn();

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

        if ($('#sexual-preference').css('visibility') !== 'visible') {
            $('#sexual-preference').css('visibility','visible').hide().fadeIn();
            $('#activity-description').css('visibility','visible').hide().fadeIn();
        }

        // Finally, update userPreferences with the new values
        var possibleIds = ['male', 'female', 'any'];
        if (possibleIds.indexOf(this.id) !== -1) {
            userPreferences.partnerGender = this.id;
        } else {
            console.error('Id not allowed');
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
        Dynamically displays a description on hovering over an activity button.
        Descriptions are correctly gendered usint templating.
    */
    $('.activity').hover(function() {
        if ($(this).is('#cuddle')) {
            $("#activity-description-text").html("Maybe hooking up isn't your style, but you love the presence of another. For when you just wanna snuggle up in someone's arms, and fall asleep gently 🐻💞💤");
        }
        else if ($(this).is('#make_out')) {
            $("#activity-description-text").html("Life is exciting, and so is variety. When you want to make out, and get to know a friend in an intimate, and wholly pleasurable way 😘🇫🇷👄");
        }
        else if ($(this).is('#eat')) {
            $("#activity-description-text").html("You're frisky and you know it, and wanna <i>get down</i> to business. For when you wanna eat out, and give each other orgasms throughout the night 👅😍💦");
        }
        else if ($(this).is('#fuck')) {
            $("#activity-description-text").html("When you're horny af, and you ain't ashamed to admit it. You just wanna have some awesome sex, no strings attached - and go ride that 🍆/🍑 until it 💦💦💦");
        }
    });

    /*
        Finally, implements the sex act selection functionality. Note that sex acts
        are not mutually exclusive, therefore function is different from the others!
    */
    $('.activity').on('click', function(event) {

        // Displays hint that multiple sexual activities can be choosen
        $('#more-activities-hint').fadeIn();

        // Fades in the search prompt after a short delay
        $('#consent-prompt').delay(1100).fadeIn();

        // Checks to make sure all 3 consent-ful checkboxes are checked
        $(".consent-check").change(function(){
            if ($('.consent-check:checked').length == $('.consent-check').length) {
                $('#consent-prompt').fadeOut();
                $('#search-prompt').delay(1100).fadeIn();
            }
        });

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

        var possibleActivities = ['cuddle', 'make_out', 'eat', 'fuck'];

        if (possibleActivities.indexOf(this.id) !== -1) {
            addOrRemove(userPreferences.activities, this.id);
        }

        if (userPreferences.activities.length === 4) {
            StartConfetti();
            setTimeout(DeactivateConfetti, 2000);
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
        requestQueue(userPreferences);
    });

    /*
        Asks if the user really wants to exit the chat
    */
    // Makes sure to prompt the user at least once.

    // Exit prompt to display
    var confirmed = false;

    $('#leave').on("click", function() {
        $('#leave').html('<span style="font-weight: bold">Are you sure?</span>');
        if (confirmed === true) {
            // Reloads the page
            window.location.href = '/';
        }
        else {
            confirmed = true;
        }
    });
});
