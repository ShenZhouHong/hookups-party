/*
    Global user preferences object. Values are defined and updated as the
    user completes the prompts. Eventually gets sent to server on submit.

    Possible values:
        selfGender:    'male' | 'female' | 'other' | undefined
        romance:        true | false | undefined
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
    romance: undefined,
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
    Generic bootstrap alert thrower. Dumps HTML for a dismissible alert inside
    the specified location, sets the type (success, warning, etc.) and message
*/
var throwAlert = function(location, type, message) {
    // I have purposely disabled this function
    return true;

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

    // Toggles the visibility of the next prompt
    if (userPreferences.selfGender == undefined) {
        // Displays the next prompt using FadeToggle (will run only once)
        $('#self-gender-comma').fadeToggle();
        $("#romance-selection").fadeToggle();
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
    if (this.id == 'man') {
        userPreferences.selfGender = 'male';
    }
    if (this.id == 'woman') {
        userPreferences.selfGender = 'female';
    }
    if (this.id == 'other') {
        userPreferences.selfGender = 'other';
    }

    console.log(userPreferences)
});

/*
    Allows the user to choose for the theme of their adventure. Either romance
    or just some fun.
*/
$('.is-looking-for').on('click', function(event) {

    toggleButton($(this), '.is-looking-for');

    // Toggles the visibility of the next prompt
    if (userPreferences.romance == undefined) {
        // Displays the next prompt using FadeToggle (will run only once)
        $('#looking-for-comma').fadeToggle();
        $("#preferences").fadeToggle();

        // Scrolls to the next prompt
        $('html, body').animate({
            scrollTop: $("#preferences").offset().top
        }, 1000);
    }
    else {
        // Otherwise, merely reassure user with comforting alert dialogue
        throwAlert(
            "#is-confirm-placeholder",
            "success",
            "Your romance setting has been changed"
        );

        // Message fades away after a second
        $("#continue-message").fadeTo(1000, 200).slideUp(200, function(){
            $("#continue-message").slideUp(200);
        });
    }

    // Finally, update userPreferences with the new values
    if (this.id == 'romance') {
        userPreferences.romance = true;
    }
    if (this.id == 'some-fun') {
        userPreferences.romance = false;
    }

    console.log(userPreferences)
});

/*
    Implements partner gender functionality. Displays the following prompt on
    first selection, otherwise throws an reassuring alert for the user
*/
$('.want-gender').on('click', function(event) {

    toggleButton($(this), '.want-gender');

    // Toggles the visibility of the next section and scrolls ONLY if first time
    if (userPreferences.partnerGender == undefined) {
        // Displays the next prompt using FadeToggle (will run only once)
        $('#want-gender-comma').fadeToggle(); // Makes grammatical sentence :P
        $('#sexual-preference').fadeToggle();

        // Also displays the final confirmation prompt, because I have no where
        // to put this. TODO: Move to somewhere else that makes sense!
        $('#confirmation').fadeToggle();
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
    }
    else {
        $('#want-gender-a').css("visibility", "visible");
    }

    // If any buttons are pressed here, previous buttons will be disabled
    if ($('.want-gender').hasClass('active')) {
        $('.is-gender').addClass('disabled');
        $('.is-looking-for').addClass('disabled');
    }
    else if ($('.want-gender').hasClass('active') == false) {
        $('.is-gender').removeClass('disabled');
        $('.is-looking-for').removeClass('disabled');
    }

    console.log(userPreferences)
});

/*
    Finally, implements the sex act selection functionality. Note that sex acts
    are not mutually exclusive, therefore function is different from the others!
*/
$('.activity').on('click', function(event) {

    /*
        Since sexual activities are not multually exclusive, checkbox-styled
        functionality is implemented here for the buttons.
    */
    event.preventDefault();
    if (($(this)).hasClass('active')) {
        $(this).removeClass('active');
        $(this).removeClass('btn-warning');
    }
    else {
        $(this).addClass('active');
        $(this).addClass('btn-warning');
    }

    /*
        Updates userPreferences with new values for sex acts. Performs a check
        on each button press, hence long if/else block.
    */
    // Making out
    if (this.id == 'make_out' && ($(this)).hasClass('active')) {
        userPreferences.make_out = true;
    }
    else if (this.id == 'make_out' && ($(this)).hasClass('active') == false) {
        userPreferences.make_out = false;
    }

    // Eating out
    if (this.id == 'eat' && ($(this)).hasClass('active')) {
        userPreferences.eat = true;
    }
    else if (this.id == 'eat' && ($(this)).hasClass('active') == false) {
        userPreferences.eat = false;
    }

    // Fucking
    if (this.id == 'fuck' && ($(this)).hasClass('active')) {
        userPreferences.fuck = true;
    }
    else if (this.id == 'make_out' && ($(this)).hasClass('active') == false) {
        userPreferences.fuck = false;
    }

    console.log(userPreferences)
});
