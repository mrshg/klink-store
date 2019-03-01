if (api.prodMode == true) {
    Stripe.setPublishableKey('pk_live_jh1C45pun6JljUneP57aUTzk');
}
else {
    Stripe.setPublishableKey('pk_test_8kxHPKkwHKTt0vnJNZRkxed0');
}
var creditCardComp = {
    init: function () {
        this.addCreditCard();
        this.setDefault();
        this.deleteCreditCard();
        this.syncFromApi();
    },
    syncFromApi: function () {
        apiHandler.getCreditCards().then(function (data) {
            creditCard.setCreditCards(data);
        });
        apiHandler.getDefaultCreditCard().then(function (data) {
            creditCard.setDefaultCreditCard(data);
        });
    },

    setDefault: function () {
        var creditCardComp = this;

        $('body').on('click', '.default-card-action', function () {
            app.startLoading();
            var $button = $(this);

            apiHandler.postDefaultCreditCard($button.attr('data-id')).then(function (data) {
                creditCard.setDefaultCreditCard(data);
                $('#profile-credit-cards').find('.btn--is-chosen').removeClass('btn--is-chosen');
                $button.addClass('btn--is-chosen');
                location.reload();
            }).fail(function () {
                location.reload();
            });
        });
    },
    addCreditCard: function () {
        var creditCardComp = this;

        $('#new-card-form').submit(function (e) {
            if (typeof(fbq) == "function") {
                fbq('track', 'AddPaymentInfo');
            }
            var $form = $(this);

            if (creditCardComp.validateNewCardForm($form)) {
                // Disable the submit button to prevent repeated clicks
                $form.find('button').prop('disabled', true);

                Stripe.card.createToken($form, creditCardComp.stripeResponseHandler);
            }

            // Prevent the form from submitting with the default action
            return false;
        });
    },
    validateNewCardForm: function (form) {
        var name = form.find('.name');
        var card_number = form.find('#credit_card_number');
        var card_month = form.find('.mm-mask');
        var card_year = form.find('.yyyy-mask');
        var cvc = form.find('.cvc-mask');
        var addr1 = form.find('.address_line1');
        var city = form.find('.address_city');
        var state = $('#address_state');
        var zip = $('.address_zip');

        if (name.val().match(/\w+\s+\w+/) == null
            || name.val().match(/\d+/g) != null
            || name.val().match(/[^\w\s,.'-]/gi) != null
        ) {
            $('#card_holder_error').show();
            name.addClass('error');

            return false;
        } else {
            $('#card_holder_error').hide();
            name.removeClass('error');
        }

        if (!$.payment.validateCardNumber(card_number.val())) {
            $('#card_number_error').show();
            card_number.addClass('error');
            return false;
        } else {
            $('#card_number_error').hide();
            card_number.removeClass('error');
        }

        if (card_month.val().match(/^\d{1,2}$/) == null
            || card_year.val().match(/^\d{4}$/) == null
        ) {
            $('#card_expiration_error').show();
            card_month.addClass('error');
            card_year.addClass('error');
            return false;
        } else {
            $('#card_expiration_error').hide();
            card_month.removeClass('error');
            card_year.removeClass('error');
        }

        if (!$.payment.validateCardCVC(cvc.val())) {
            $('#card_cvc_error').show();
            cvc.addClass('error');
            return false;
        } else {
            $('#card_cvc_error').hide();
            cvc.removeClass('error');
        }

        if (addr1.val() == null || addr1.val() == "") {
            $('#card_addr1_error').show();
            addr1.addClass('error');
            return false;
        } else {
            $('#card_addr1_error').hide();
            addr1.removeClass('error');
        }

        if (city.val() == null || city.val() == "") {
            $('#card_city_error').show();
            city.addClass('error');
            return false;
        } else {
            $('#card_city_error').hide();
            city.removeClass('error');
        }

        if (state.val() == null || state.val() == "") {
            $('#card_state_error').show();
            state.addClass('error');
            return false;
        } else {
            $('#card_state_error').hide();
            state.removeClass('error');
        }

        if (zip.val() == null || zip.val() == "") {
            $('#card_zip_error').show();
            zip.addClass('error');
            return false;
        } else {
            $('#card_zip_error').hide();
            zip.removeClass('error');
        }
        return true;
    },
    stripeResponseHandler: function (status, response) {
        app.startLoading();

        var $form = $('#new-card-form');

        if (response.error) {
            // Show the errors on the form
            $form.find('.payment-errors').each(function () {
                $(this).text(response.error.message);
                $(this).show();
            });
            $form.find('button').prop('disabled', false);

            app.stopLoading();
        } else {
            // token contains id, last4, and card type
            var token = response.id;

            // Hide the errors on the form
            $form.find('.payment-errors').each(function () {
                $(this).hide();
            });

            apiHandler.postCreditCards(token)
                .then(function (data) {
                    apiHandler.postDefaultCreditCard(data.id).then(function (data) {
                        creditCard.setDefaultCreditCard(data);
                        location.reload();
                    })
                })
                .fail(function (response) {
                    $form.find('.payment-errors').each(function () {
                        $(this).text(response.responseJSON.message);
                        $(this).show();
                    });
                    $form.find('button').prop('disabled', false);
                    $('html, body').animate({scrollTop: '0px'}, 300);
                    app.stopLoading();
                })


        }
    },
    generateHtmlForCardList: function (data) {
        var html = ' <article class="card-item">' +
            '<div class="content">' +
            '<div class="card-item__data">' +
            '<div class="center">' +
            '<h2>Personal card</h2>' +
            '<p>' + data.brand + '</p>' +
            '<p>**** **** **** ' + data.last4digits + '</p>' +
            '</div>' +
            '</div>' +
            '<div class="card-item__actions">' +
            '<div class="btn-group">' +
            '<button type="button" class="btn btn--gray-hasborder default-card-action" data-id="' + data.id + '">Default</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</article>';

        return html;
    },
    deleteCreditCard: function () {
        $('.delete-card--action').on('click', function () {
            app.startLoading();
            var cardId = $(this).attr('data-id');

            apiHandler.deleteCreditCard(cardId).then(function () {
                location.reload();
            });
        });
    },
    populateDeleteCardModal: function (cardId) {
        $('#modal-delete-card .delete-card--action').attr('data-id', cardId);
    },
    populateChooseCardModal: function () {
        var cards = creditCard.getCreditCards();
        var html = '';
        $.each(cards, function (index, card) {
            html += '<li> ' +
                '<label for="credit-card-' + card.id + '">' +
                card.brand + '<br>' +
                '**** **** **** ' + card.last4digits +
                '</label> ' +
                '<input type="radio" class="default-card-action" id="credit-card-' + card.id + '" data-id="' + card.id + '" /> ' +
                '</li>';
        });

        $('#modal-choose-credit-card .credit-card-list ul').html(html);
    }
};