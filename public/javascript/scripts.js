/*
    Global user preferences object. Values are defined and updated as the
    user completes the prompts. Eventually gets sent to server on submit.

    Possible values:
        selfGender:    'male' | 'female' | 'other' | undefined
        partnerGender: 'male' | 'female' | 'both' | undefined
        make_out:       true | false
        eat:            true | false
        fuck:           true | false

    By default, all sex acts are false. Because consent, that's why!
    Note: An user_preferences object with undefined values or all sex acts
    set to false is invalid, and should not be sent to server.
*/
var userPreferences = {
    selfGender: undefined,
    partnerGender: undefined,
    make_out: false,
    eat: false,
    fuck: false
};

/*
    Generic button toggler. Implements radio buttion functionality on a group
    of buttons with a shared class (the 'group' argument).
*/
var toggleButton = function(element, group) {
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
    Generic bootstrap alert thrower. Dumps HTML for a dismissible alert inside
    the specified location, sets the type (success, warning, etc.) and message
*/
var throwAlert = function(location, type, message) {
    // WARNING: the location will be cleared beforehand!
    $(location).val('');

    $(location).html(`
        <div class="alert alert-${type} alert-dismissible" role="alert" id="continue-message">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>${message}
        </div>
    `);
};

/*
    Implements user gender prompt functionality. Scrolls down to the next page
    on first selection, otherwise assures the user their choice is upddated.
*/
$('.is-gender').on('click', function(event) {

    toggleButton($(this), '.is-gender');

    // Toggles the visibility of the next section and scrolls ONLY if first time
    if (userPreferences.selfGender == undefined) {
        // Smooth-scrolling functionality
        $('html, body').animate({
            scrollTop: $("#preferences").offset().top
        }, 1000);
    }
    else {
        // Otherwise, merely reassure user with comforting alert dialogue
        throwAlert(
            "#is-confirm-placeholder",
            "success",
            "Your gender has been changed <span>( ͡° ͜ʖ ͡°)</span>"
        );

        // Message fades away after a second
        $("#continue-message").fadeTo(1000, 200).slideUp(200, function(){
            $("#continue-message").slideUp(200);
        });
    }

    // Finally, update userPreferences with the new values
    if (this.id == '#man') {
        userPreferences.selfGender = 'male';
    }
    if (this.id == '#woman') {
        userPreferences.selfGender = 'female';
    }
    if (this.id == '#other') {
        userPreferences.selfGender = 'other';
    }
});

/*
    Implements partner gender functionality. Displays the following prompt on
    first selection, otherwise throws an reassuring alert for the user
*/
$('.want-gender').on('click', function(event) {

    toggleButton($(this), '.want-gender');

    // Toggles the visibility of the next section and scrolls ONLY if first time
    if (userPreferences.selfGender == undefined) {
        // Displays the next prompt using FadeToggle (will run only once)
        $('#want-gender-comma').fadeToggle(); // Makes grammatical sentence :P
        $('#sexual-preference').fadeToggle();
    }
    else {
        // Otherwise, merely reassure user with comforting alert dialogue
        throwAlert(
            "want-confirm-placeholder",
            "success",
            "Your sexual preferences has been changed <span>( ͡° ͜ʖ ͡°)</span>"
        );

        // Message fades away after a second
        $("#continue-message").fadeTo(1000, 200).slideUp(200, function(){
            $("#continue-message").slideUp(200);
        });
    }

    // Finally, update userPreferences with the new values
    if (this.id == '#male') {
        userPreferences.partnerGender = 'male';
    }
    if (this.id == '#female') {
        userPreferences.partnerGender = 'female';
    }
    if (this.id == '#any') {
        userPreferences.partnerGender = 'any';
    }
});
