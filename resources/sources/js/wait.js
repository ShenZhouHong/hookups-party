/* Makes sure that the DOM is only manipulated when ready */
$(function () {
    "use strict";
    var a = function() {
        var date = new Date ();
        var target = new Date();
        target.setHours(23);
        target.setMinutes(30);
        target.setSeconds(0);
        console.log(date);
        console.log(target);
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
});
