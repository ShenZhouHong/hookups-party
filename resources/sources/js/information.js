/* Makes sure that the DOM is only manipulated when ready */
$(function () {
    "use strict";

    console.log( "ready!" );

    $('#learn-more').on('click', function(event) {
        $('html, body').animate({
            scrollTop: $("#slide02").offset().top
        }, 1000);

        StartConfetti();
        setTimeout(DeactivateConfetti, 1000);
    });
});
