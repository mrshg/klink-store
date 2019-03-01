// =============================================================================
// Sticky secondary navigation
// =============================================================================

if ($('.navigation-secondary').length) {
$(".navigation-secondary").headroom({
    offset: $(".navigation-secondary").offset().top - $(".navigation-secondary").height()
  });
};

