/* Makes sure that the DOM is only manipulated when ready */
$(function () {
    "use strict";

    var target = new Date();
    target.setHours(23);
    target.setMinutes(0);
    target.setSeconds(0);

    var countdown = function() {
        var date = new Date ();

        var remaining = Math.floor((target.getTime() - date.getTime()) / 1000);
        if (remaining < 0 && remaining > -3) {
            location.reload();
        }
        $("#heartbeats").text(remaining);
    };

    countdown();

    $("#heartbeats").css("opacity", 1);
    window.setInterval(countdown, 1000);

    $('#testimonials').on('click', function(event) {
        $('html, body').animate({
            scrollTop: $("#stories-heading").offset().top
        }, 1000);

        StartConfetti();
        setTimeout(DeactivateConfetti, 1000);
    });
});
