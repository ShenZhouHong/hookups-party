firstGenderSelect = true;
firstGenderChoice = true;

$('.is-gender').on('click', function(event) {
    event.preventDefault(); // To prevent following the link (optional)

    // Locks in this button
    $('.is-gender').removeClass('active');
    $('.is-gender').removeClass('btn-primary');
    $(this).addClass('active');
    $(this).addClass('btn-primary');


    // Prevents annoying scroll behavior on second choice.
    if (firstGenderSelect == true) {
        $('html, body').animate({
            scrollTop: $("#preferences").offset().top
        }, 1000);
        firstGenderSelect = false;
    }
    else {
        // Tells user to advance on to the next slide
        $('#is-confirm-placeholder').html('<div class="alert alert-success alert-dismissible" role="alert" id="continue-message"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Success!</strong> Your gender has been changed <span>( ͡° ͜ʖ ͡°)</span></div>');
        $("#continue-message").fadeTo(1000, 200).slideUp(200, function(){
            $("#continue-message").slideUp(200);
        });
    }
});

$('.want-gender').on('click', function(event) {
    event.preventDefault(); // To prevent following the link (optional)

    // Locks in this button
    $('.want-gender').removeClass('active');
    $('.want-gender').removeClass('btn-primary');
    $(this).addClass('active');
    $(this).addClass('btn-primary');

    // Prevents annoying scroll behavior on second choice.
    if (firstGenderChoice == true) {
        firstGenderChoice = false;
    }
    else {
        // Tells user to advance on to the next slide
        $('#want-confirm-placeholder').html('<div class="alert alert-success alert-dismissible bottom" role="alert" id="continue-message"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Success!</strong> Your preference has been changed <span>( ͡° ͜ʖ ͡°)</span></div>');
        $("#continue-message").fadeTo(1000, 200).slideUp(200, function(){
            $("#continue-message").slideUp(200);
        });
    }
});

$('.activity').on('click', function(event) {
    event.preventDefault(); // To prevent following the link (optional)

    // Locks in this button
    $(this).addClass('active');
    $(this).addClass('btn-primary');
});
