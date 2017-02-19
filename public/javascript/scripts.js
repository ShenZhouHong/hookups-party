$('.is-gender').on('click', function(event) {
    event.preventDefault(); // To prevent following the link (optional)
    $('html, body').animate({
        scrollTop: $("#preferences").offset().top
    }, 1000);
});
