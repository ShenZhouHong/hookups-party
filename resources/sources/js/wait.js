/* Makes sure that the DOM is only manipulated when ready */
$(function () {
    "use strict";
    var a = function() {
        var date = new Date();
        var second = parseInt(date.toLocaleString('en-US', {second: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' }));
        var minute = parseInt(date.toLocaleString('en-US', {minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' }));
        var hour = parseInt(date.toLocaleString('en-US', {hour: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' }));
        var remaining = (((23 - hour) * 60) + 30 - minute) * 60 - second;
        console.log(remaining);
        if (! remaining) {
            $(location).attr('href', '/');
        }
        $("#heartbeats").text(remaining);
    };
    a();
    $("#heartbeats").css("opacity", 1);
    window.setInterval(a, 1000);
});
