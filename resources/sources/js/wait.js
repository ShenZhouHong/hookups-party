/* Makes sure that the DOM is only manipulated when ready */
$(function () {
    "use strict";
    var a = function() {
        var date = new Date ();
        var target = new Date();
        target.setHours(23);
        target.setMinutes(00);
        target.setSeconds(0);

        var remaining = (target.getTime() - date.getTime()) / 1000 + 20;
        console.log(remaining);
        if (remaining < 0 && remaining > -3) {
            location.reload();
        }
        $("#heartbeats").text(remaining);
    };
    a();
    $("#heartbeats").css("opacity", 1);
    window.setInterval(a, 1000);

    $('#learn-more').on('click', function(event) {
        $('html, body').animate({
            scrollTop: $("#slide02").offset().top
        }, 1000);

        StartConfetti();
        setTimeout(DeactivateConfetti, 4000);
    });
});
