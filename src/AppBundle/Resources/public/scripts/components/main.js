var app = app || {};
$.cookieStorage.setPath('/');
var $overlay = $('.page-wrap');
var modalOptions = {
    closeOnBgClick: true,
    showCloseBtn: true,
    midClick: false
};
var datepickerOptions = {
    changeMonth: true,
    changeYear: true,
    showOn: "button",
    buttonImage: "assets/dist/img/date.png",
    buttonImageOnly: true,
    buttonText: "Select date"
};

function prePopulateModal(dataId, modalId, storeId, packageItem) {

    if (modalId == '#modal-edit-address') {
        addressComp.populateEditAddressModal(dataId, modalId);
    }
    if (modalId == '#modal-edit-address-checkout') {
        addressComp.populateEditAddressCheckoutModal(dataId, modalId);
    }
    if (modalId == '#modal-update-info') {
        // app.addLoadingSpan(modalId);
        profileComp.populateEditUserModal();
    }
    if (modalId == '#modal-update-info-checkout') {
        // app.addLoadingSpan(modalId);
        profileComp.populateEditUserCheckoutModal();
    }
    if (modalId == '#modal-drink-item') {
        //app.addLoadingSpan(modalId);
        product.populateProductModal(dataId, storeId, packageItem)
    }
    if (modalId == '#modal-update-address') {
        addressComp.populateUpdateAddressModal(modalId);
    }
    if (modalId == '#modal-delete-card') {
        creditCardComp.populateDeleteCardModal(dataId);
    }
    if (modalId == '#modal-delete-address') {
        addressComp.populateDeleteAddressModal(dataId);
    }
    if (modalId == '#modal-choose-credit-card') {
        creditCardComp.populateChooseCardModal();
    }
}

// app.addLoadingSpan = function (modalId) {
//     var loading = '<span class="preloader"><span class="one"></span><span class="two"></span><span class="three"></span> <span class="four"></span> <span class="five"></span> </span>';
//     $(modalId + ' .modal__body').html(loading);
// };
app.addLoadingSpan = function (modalId) {
    var loading = '';
    $(modalId + ' .modal__body').html(loading);
};

app.getNextPage = function () {
    var $page = $('.load-more');
    var page = $page.attr('data-page');

    $page.attr('data-page', ++page);

    return page;
};

app.resetPage = function () {
    if (!$('.load-more').length) {
        $('.browse-drinks-main-section').append('<div class="load-more-wrap"> ' +
            '<div class="load-more btn btn--link" data-page="1">Loading ... </div> ' +
            '</div>')
    }
    var $page = $('.load-more');
    $page.attr('data-page', '1');
};

app.formatFormErrors = function (rawFormErrors) {
    if (rawFormErrors.hasOwnProperty('errors')) {
        var errorText = '';
        $.each(rawFormErrors.errors, function (key, value) {
            errorText += '<p>' + value + '</p>';
        });
        return errorText;
    }
};
app.displayFormErrors = function ($form, rawFormErrors) {
    $form.find('.errors').remove();
    $form.prepend('<div class="errors"></div>');
    var errors = app.formatFormErrors(rawFormErrors);
    $form.find('.errors').html(errors);
    $('html, body').animate({scrollTop: '0px'}, 300);
};

app.displaySingleFormMessage = function ($form, formMessage) {
    $form.find('.errors').remove();
    $form.find('.messages').remove();
    $form.prepend('<div class="messages"></div>');

    $form.find('.messages').html(formMessage);
    $('html, body').animate({scrollTop: '0px'}, 300);
};

app.displaySingleFormError = function ($form, formError) {
    $form.find('.errors').remove();
    $form.prepend('<div class="errors"></div>');

    $form.find('.errors').html(formError);
    $('html, body').animate({scrollTop: '0px'}, 300);
};

app.startLoading = function () {
    // if(!$('.site-loading').lenght) {
    //     $('body').prepend('<div class="site-loading"><div class="circle"></div></div>');
    // };
    if (!$('.site-loading').lenght) {
        $('.site-loading').css({'opacity': '1', 'pointer-events': 'auto'})
    }
    ;
};
app.stopLoading = function () {
    // $('.site-loading').remove();
    $('.site-loading').css({'opacity': '0', 'pointer-events': 'none'})
};

app.stopPageLoading = function () {
    $('.page-load-circle').css({'opacity': '0', 'pointer-events': 'none'});
};

app.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results) {
        return results[1]
    }

    return null;
};
app.formatPrice = function (price) {
    price = price / 100;

    return '$' + price.toFixed(2);
};

app.getUrlParameter = function (sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function initModalTimeSelectionSlider() {
    $('.modal-slider-time-selection').slick({
        autoplay: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        appendArrows: '.modal-time-selection-slider-arrows',
        prevArrow: '<i class="icon" data-icon="b">',
        nextArrow: '<i class="icon" data-icon="c">'
    });
}


$(document).ready(function () {

    packComp.setCartVariants();
    $('.activate-modal-link.page1').magnificPopup(modalOptions);
    $('.activate-modal-link').magnificPopup(modalOptions);

    $('.filtering--action').on('click', function (e) {
        e.preventDefault();
        $('body').toggleClass('filter-active');
    });
    $('.filtering--action-close').on('click', function (e) {
        e.preventDefault();
        $('body').removeClass('filter-active');
    });


    $('.search-btn').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#search-terms').select();
        $('.search-form-wrapper').addClass('active');
        $('.search-form-wrapper .icon').addClass('submit-search--action');

        $('.submit-search--action').on('click', function () {
            $('form#search-form').submit();
            app.startLoading();
        });

        // on search focus out
        $("body").mouseup(function (e) {
            var container = $(".search-form-wrapper");

            if (!container.is(e.target)
                && container.has(e.target).length === 0) {
                container.removeClass('active');
                $('.search-btn i.icon').removeClass('submit-search--action');
            }
        });
    });

    $('#search-terms').on('click', function (e) {
        e.stopPropagation();
    });

    // Input Masks - https://igorescobar.github.io/jQuery-Mask-Plugin/
    $('.date-mask').mask('00/00/0000');
    $('.phone-mask').mask('(000) 000-0000');
    $('.mm-mask').mask('00');
    $('.yyyy-mask').mask('0000');

    // Credit Card Mask - https://stripe.com/blog/jquery-payment
    $('.cc-mask').payment('formatCardNumber');
});

//infinite scroll
app.scrolled = false;

$(window).scroll(function () {
    if ($('body .load-more').length) {

        var window_top = $(window).scrollTop() + $(window).height();
        var div_top = $('.load-more').offset().top;

        if (window_top >= div_top) {
            if (app.scrolled == false) {
                app.scrolled = true;
                productComp.loadMoreProducts();
            }
        }
    }
});

