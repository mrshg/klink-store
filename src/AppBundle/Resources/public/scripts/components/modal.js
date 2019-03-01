var modal = {
    openLoginModal: function () {
        $('.trigger-modal-login').trigger('click');
    },
    openUserDesclaimerModal: function () {
        $('.trigger-modal-user-desclaimer').trigger('click');
    },
    openRegisterModal: function () {
        $('.trigger-modal-register').trigger('click');
    },
    openContactModal: function () {
        $('.trigger-modal-contact').trigger('click');
    },
    openGetAppModal: function () {
        $('.trigger-modal-get-app').trigger('click');
    },

    openChangeAddressInitModal: function () {
        $('.trigger-initial-address-setup-notlogged').trigger('click');
    },

    openUpdateAddressModal: function () {
        $('.trigger-modal-update-address').trigger('click');
    },

    openVerifyAddressModal: function () {
        $('.trigger-modal-verify-address').trigger('click');
    },

    openStoreClosedModal: function () {
        $('.trigger-modal-store-closed').trigger('click');
    },

    openStoreOutOfAreaModal: function () {
        $('.trigger-modal-store-outofarea').trigger('click');
    },

    openDeleteCartConfirmModal: function () {
        $('.trigger-modal-delete-cart-confirm').trigger('click');
    },

    openUpdateInfoModal: function () {
        $('.trigger-modal-update-info').trigger('click');
    },

    openUpdateInfoCheckoutModal: function () {
        $('.trigger-modal-update-info-checkout').trigger('click');
    },
    openNoAvailableStoresModal: function () {
        $('.trigger-modal-no-available-stores').trigger('click');
    },
    openAnotherAvailableStoresModal: function () {
        $('.trigger-modal-another-available-stores').trigger('click');
    },
    openChooseCreditCardModal: function () {
        $('.trigger-modal-choose-credit-card').trigger('click');
    },
    openAddCreditCardModal: function () {
        $('.trigger-modal-add-card').trigger('click');
    },
    openResetPasswordModal: function () {
        $('.trigger-modal-reset-password').trigger('click');
    },
    openAddAddress: function () {
        $('.trigger-modal-add-address').trigger('click');
    },
    openPromoCodeModal: function () {
        $('.trigger-modal-promo-code').trigger('click');
    },
    openRemovePromoCodeModal: function () {
        $('#_promo_code_remove').val(cart.getCoupon());
        $('.trigger-modal-promo-code-remove').trigger('click');
    },

    openMaxQuantityCart: function() {
        $('.trigger-modal-max-quantity-cart').trigger('click');
    },

    openDeleteCartConfirm: function () {
        $('.trigger-modal-delete-cart').trigger('click');

        var deferred = jQuery.Deferred();
        $('#modal-delete-cart a.confirm-delete-cart--action').on('click', function () {
            apiHandler.deleteCart();
            deferred.resolve(true);
        });
        $('#modal-delete-cart a.cancel-delete-cart--action').on('click', function () {
            deferred.reject(false);
        });
        return deferred.promise();

    },
    openChangingStoreModal: function () {
        $.magnificPopup.open({
            items: {
                src: '#modal-change-store',
                type: 'inline'
            },
            callbacks: {
                beforeOpen: function () {
                    $overlay.addClass('blur');
                },
                open: function () {
                    $.magnificPopup.instance.content.addClass('active');
                },
                beforeClose: function () {
                    $overlay.removeClass('blur');
                }
            }
        });
    },
    openProductModalOnLoad: function (name, storeId) {
        $(document).ready(function () {
            var $triggerDrinkModal = $('.trigger-modal-drink-item');
            $triggerDrinkModal.attr('data-id', name);
            $triggerDrinkModal.attr('data-storeId', storeId);
            $triggerDrinkModal.trigger('click');
        });
    },
    openLoginModalOnLoad: function () {
        $(document).ready(function () {
            var $triggerLoginModal = $('.trigger-modal-login');
            $triggerLoginModal.trigger('click');
        });
    },
    openRegisterModalOnLoad: function () {
        $(document).ready(function () {
            var $triggerRegisterModal = $('.trigger-modal-register');
            $triggerRegisterModal.trigger('click');
        });
    },
    openErrorModal: function () {
        $.magnificPopup.open({
            items: {
                src: '#modal-error',
                type: 'inline'
            },
            callbacks: {
                beforeOpen: function () {
                    $overlay.addClass('blur');
                },
                open: function () {
                    $.magnificPopup.instance.content.addClass('active');
                },
                beforeClose: function () {
                    $overlay.removeClass('blur');
                }
            }
        });
    }
};
