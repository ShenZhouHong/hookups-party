firstGenderSelect = true;

$('.is-gender').on('click', function(event) {
    event.preventDefault(); // To prevent following the link (optional)

    // Locks in this button
    $('.is-gender').removeClass('active');
    $(this).addClass('active');

    // Prevents annoying scroll behavior on second choice.
    if (firstGenderSelect == true) {
        $('html, body').animate({
            scrollTop: $("#preferences").offset().top
        }, 1000);
        firstGenderSelect = false;
    }
    else {
        // Tells user to advance on to the next slide
        console.log("Else'ed");
        $('#alert-placeholder-here').html('<div class="alert alert-success alert-dismissible bottom" role="alert" id="continue-message"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Success!</strong> Your gender has been changed ;)</div>');
    }
});

$('.want-gender').on('click', function(event) {
    event.preventDefault(); // To prevent following the link (optional)

    // Locks in this button
    $(this).addClass('active');

    $('html, body').animate({
        scrollTop: $("#activities").offset().top
    }, 1000);
});
