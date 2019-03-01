// =============================================================================
// Scroll Top
// =============================================================================

if ($('.back-to-the-top').length) {
    $('.back-to-the-top').on('click', function (e) {
        e.preventDefault();
        $("html, body").animate({scrollTop: 0}, "fast");
    });
}