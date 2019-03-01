// =============================================================================
// Slider init
// =============================================================================


if ($('.drink-item-slider').length) {
    initDrinkItemSlider();
}
if ($('.today-featured-slider').length) {
    initTodayFeturedSlider();
}
if ($('.featured-drink-item-slider').length) {
    initFeaturedDrinkItemSlider();
}
if ($('.featured-host-collections-slider').length) {
    initFeaturedHostCollectionsSlider();
}

if ($('.drinks-data-slider').length) {
    initDrinkDataSlider();
}


function initDrinkDataSlider() {

    $('.drinks-data-slider').slick({
        autoplay: false,
        speed: 350,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        fade: false
    });
}


function initDrinkItemSlider() {

    $('.drink-item-slider').slick({
        autoplay: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: false,
        dots: false,
        appendArrows: '.drink-item-slider-arrows',
        prevArrow: '<i class="icon" data-icon="b">',
        nextArrow: '<i class="icon" data-icon="c">',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    });


}
function initFeaturedDrinkItemSlider() {

    $('.featured-drink-item-slider').slick({
        autoplay: false,
        speed: 300,
        slidesToShow: 6,
        slidesToScroll: 6,
        infinite: false,
        dots: false,
        appendArrows: '.featured-drink-item-slider-arrows',
        prevArrow: '<i class="icon" data-icon="b">',
        nextArrow: '<i class="icon" data-icon="c">',
        respondTo: 'slider',
        responsive: [
            {
                breakpoint: 1050,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5
                }
            },
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 560,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    });
}

function initFeaturedHostCollectionsSlider() {

    $('.featured-host-collections-slider').slick({
        autoplay: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: false,
        dots: false,
        appendArrows: '.featured-host-collection-arrows',
        prevArrow: '<i class="icon" data-icon="b">',
        nextArrow: '<i class="icon" data-icon="c">',
        responsive: [
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    });
}


function initTodayFeturedSlider() {
    $('.today-featured-slider').slick({
        autoplay: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        appendArrows: '.featured-selection-slider-arrows',
        prevArrow: '<i class="icon" data-icon="b">',
        nextArrow: '<i class="icon" data-icon="c">',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 570,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 450,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
}



$(document).ready(function () {
    var w = $(window);
    var toggleSlick;
    var $navigationSlider= $('.navigation-secondary__slider');

    toggleSlick = function () {
    if (w.width() < 600) {
        if (!$navigationSlider.hasClass('slick-initialized')) {
          $navigationSlider.slick({
            speed: 350,
            infinite: false,
            centerMode: false,
            fade: false,
            slidesToShow:3,
            slidesToScroll: 3,
            arrows: true,
            dots: false
          });
           var barIndex = $navigationSlider.find('.active').data('slick-index');
            $navigationSlider.slick('slickGoTo', parseInt(barIndex));

        }
        var $countSlides = $('.navigation-secondary__slider li').length;
        if ($countSlides <= 2) {
            $navigationSlider.slick('unslick');
        }

    } else {

        if ($navigationSlider.hasClass('slick-initialized')) {
            $navigationSlider.slick('unslick');
        }

    }
  }
  w.resize(toggleSlick);
  toggleSlick();



            //  $navigationSlider.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
            //   $slideCount = slick.slideCount;
            //   console.log($slideCount);

            // });


function deviceType() {
    //detect if desktop/mobile
    return window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
}

//check the media query and bind corresponding events
    var MQ = deviceType(),
        bindToggle = false;

    bindEvents(MQ, true);

    w.on('resize', function () {
        MQ = deviceType();
        bindEvents(MQ, bindToggle);
        if (MQ == 'mobile') bindToggle = true;
        if (MQ == 'desktop') bindToggle = false;
    });
    function bindEvents(MQ, bool) {

        if (MQ == 'desktop' && bool) {

            w.on('scroll', function () {
                var t = 1 - ($(this).scrollTop() / 700).toFixed(2),
                    b = 1 - ($(this).scrollTop() / 550).toFixed(2),
                    n = -(0.05 * $(this).scrollTop()).toFixed(2);
                $(".site-head-content").css({
                    opacity: t,
                    "transform": "translate(0, " + n + "%)",
                    "-webkit-transform": "translate(0, " + n + "%)",
                    "-moz-transform": "translate(0, " + n + "%)",
                    "-o-transform": "translate(0, " + n + "%)"
                });
                $("#bg").css({
                    opacity: b
                });


            });

        } else if (MQ == 'mobile') {

        }
    }


});

