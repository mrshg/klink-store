var checkoutComp = {
    init: function () {
        var checkoutComp = this;

        $('.cart-checkout').remove();
        var width = $(window).width();
        if(width >= 720) {
            $('body').addClass('cart-active');
        }

        $('#checkout-send-my-order').on('click', function (e) {
            e.preventDefault();
            if (!$.cookieStorage.get('isDisclaimer')) {
                modal.openUserDesclaimerModal();
            } else {
                checkoutComp.processOrder();
            }
        });
        $('#user-desclaimer-checkout').on('click', function(event){
            event.preventDefault();
            if ($('#user-desclaimer-dont-show:checked').length) {
                $.cookieStorage.set('isDisclaimer', true);
            }
            $.magnificPopup.instance.close();
            checkoutComp.processOrder();
        });

        this.clickOnCardsActions();

        $(document).ready(function () {
            checkoutComp.validateCheckoutData();
        });
    },

    validateCheckoutData: function() {
        // validate if user has all requested data
        var userProfile = user.getUserDetailedInfo();
        var cartData = cart.getCart();

        var errors = false;

        $('.page-actions--checkout .error-msg').remove();

        if (!userProfile.phone_number) {
            this.addErrorMessage(
                '<a href="#modal-update-info" class="activate-modal-link" data-effect="mfp-zoom-in">' +
                'Enter valid phone number.' +
                '</a>');
            errors = true;
            $.localStorage.set('checkoutInfoModal', true);
            modal.openUpdateInfoCheckoutModal();
        }

        if (!userProfile.birthday) {
            this.addErrorMessage(
                '<a href="#modal-update-info" class="activate-modal-link" data-effect="mfp-zoom-in">' +
                'Please provide your birthday.' +
                '</a>'
            );
            errors = true;
            $.localStorage.set('checkoutInfoModal', true);
            modal.openUpdateInfoCheckoutModal();
        }
        else {
            var birthdayErrors = profileComp.checkValidBirthday(userProfile.birthday);
            for (var i = 0; i < birthdayErrors.length; i++) {
                this.addErrorMessage(birthdayErrors[i]);
                errors = true;
            }

            var adultErrors = profileComp.checkIfAdult(userProfile.birthday);
            for (var i = 0; i < adultErrors.length; i++) {
                this.addErrorMessage(adultErrors[i]);
                errors = true;
            }
        }

        if (!creditCard.getDefaultCreditCard().id) {
            this.addErrorMessage(
                '<a href="#modal-add-credit-card" class="activate-modal-link" data-effect="mfp-zoom-in">' +
                'Enter valid payment.' +
                '</a>'
            );
            errors = true;

            modal.openAddCreditCardModal();
        }

        if (!address.getDefaultAddress()) {
            this.addErrorMessage(
                '<a href="#modal-update-address" class="activate-modal-link" data-effect="mfp-zoom-in">' +
                'Add your address.' +
                '</a>'
            );
            errors = true;
        }
        else if (store.isSampleStore()) {

            this.addErrorMessage(
                '<a href="#modal-update-address" class="activate-modal-link" data-effect="mfp-zoom-in">' +
                'Change your address, your store is out of area.' +
                '</a>'
            );
            errors = true;
        }

        if (store.isStoreClosed()) {
            this.addErrorMessage(
                '<a href="#modal-update-address" class="activate-modal-link" data-effect="mfp-zoom-in">' +
                'Change your address, your store is closed.' +
                '</a>'
            );
            errors = true;
        }

        if (cartData.checkout_message) {
            this.addErrorMessage(cartData.checkout_message);
            errors = true;
        }

        if (cart.getItemsTotal() == 0) {
            this.addErrorMessage('<a href="/discover">Add items to cart.</a>');
            errors = true;
        }

        if (errors) {
            $('.page-actions--checkout .success-msg').hide();

            app.stopLoading();
            $('.activate-modal-link').magnificPopup(modalOptions);

            return;
        }
        else {
            $('.page-actions--checkout .success-msg').show();
            if (!$.localStorage.get('checkoutInfoModal')) {
                $.localStorage.set('checkoutInfoModal', true);
                modal.openUpdateInfoCheckoutModal();
            }
        }
    },

    processOrder: function() {
        app.startLoading();
        $('.error-msg').remove();

        // validate if user has all requested data
        this.validateCheckoutData();

        var userProfile = user.getUserDetailedInfo();
        checkout.initOrder(userProfile);
        var order = checkout.getOrder(userProfile);

        apiHandler.putCartStartCheckout(order).then(function (data) {
            apiHandler.getCartCheckoutFinalize().then(function (data) {
                data.forEach(function(checkoutData){
                    var totalPriceFormated = checkoutData.total/100;
                    window.SPWORLD = window.SPWORLD || [];
                    SPWORLD.push({"type":"segment", "id":[29016]}, {"type":"conversion", "id":[1734], "order_id":checkoutData.id, "value":totalPriceFormated});
                });
                apiHandler.putCartCheckoutFinalize().then(function (data) {
                    checkoutComp.completeCheckout();
                }).fail(function (data) {
                    $('.page-actions--checkout').append('<div class="error-msg">'+data.responseJSON['message']+'</div>');
                    $('.page-actions--checkout .success-msg').hide();
                    app.stopLoading();
                });
            });

        });
    },

    addErrorMessage: function(message) {
        if($('.page-actions--checkout .error-msg').html()) {
            $('.page-actions--checkout .error-msg').append(' '+message);
        }
        else {
            $('.page-actions--checkout').append('<div class="error-msg">To complete checkout: ' + message + '</div>')
        }
    },

    createThankyouPage: function() {
        $.ajax({
            method: 'GET',
            url: api.assetUrl+"checkout/postorder"
        }).success(function (html) {
            $.localStorage.set('add_tip', false);
            $.localStorage.set('checkoutInfoModal', false);

            $('header.top-header').remove();
            $('.page-wrap').html(html);
            $('html, body').animate({scrollTop: '0px'}, 300);
            app.stopLoading();
        });
    },

    completeCheckout: function() {
        checkout.removeCheckout();
        cart.removeCart();
        cartComp.updateHeader();

        $('body').removeClass('cart-active');
        $('body').removeClass('cart-active-saved');
        $('#cart-dropdown').remove();

        checkoutComp.createThankyouPage();
    },

    showDisabledCheckoutErrorModal: function() {
        var cartData = cart.getCart();
        var error = cartData.checkout_message;

        $('#modal-error .modal__title').html('Checkout is not possible');
        $('#modal-error .modal__body').html(error);

        modal.openErrorModal();
    },

    clickOnCardsActions: function() {
        $('.checkout-review__info .user-info').on('click', function() {
            $.localStorage.set('checkoutInfoModal', true);
            modal.openUpdateInfoCheckoutModal();
        });
        $('.checkout-review__info .card-info').on('click', function() {
            if(creditCard.getDefaultCreditCard().id) {
                modal.openChooseCreditCardModal();
            }
            else {
                modal.openAddCreditCardModal();
            }
        });
        $('.checkout-review__address').on('click', function() {
            $('.checkout-address-item__actions a').click();
        });
    }
};