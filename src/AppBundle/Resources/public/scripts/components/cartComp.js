var cartComp = {
    init: function () {
        if (!$.localStorage.get('add_tip')) {
            $.localStorage.set('add_tip', true);
            $.localStorage.set('tip', 0.1);
            this.updateTipAmountWithPercent();
        }
        this.updateHeader();
        this.updateCartData();
        this.markProductsInCart();
        this.incItemQty();
        this.decItemQty();
        this.updateItemQty();
        this.initCartDisplay();
        this.displayCart();
        this.changeTipAmount();
        this.changeTipPercent();
        this.validateTipInput();
        this.initTipInput();
        this.couponClick();
        this.couponRemoveClick();
        $('.cart-pack-group').on('click', function () {
            $(this).children('.cart-pack-group-more').slideToggle(300);
        });

        //disable checkout
        $("a.cart-checkout").on("click", function (event) {
            if (cartComp.checkIfCanAddToCartAndCheckout() == false) {
                $('a.cart-checkout').attr('disabled', 'disabled');
            } else {
                $('a.cart-checkout').removeAttr('disabled');
            }

            if ($(this).is("[disabled]")) {
                event.preventDefault();
                checkoutComp.showDisabledCheckoutErrorModal();
            } else {
                if (typeof(fbq) == "function") {
                    fbq('track', 'InitiateCheckout');
                }
            }
        });
    },

    initNotLoggedIn: function () {
        this.incItemQty();
        this.decItemQty();
        this.updateItemQty();
        this.addToCartNotLogged();
    },

    addToCartNotLogged: function () {
        $('.add-to-cart-not-logged--action').on('click', function () {
            var variantId = $(this).attr('data-id');
            cart.setItemInCartNotLogged(variantId);
        })
    },

    addToCartAfterLogin: function () {
        if (typeof(fbq) == "function") {
            fbq('track', 'AddToCart');
        }
        if (user.getUserInfo()) {
            var itemToAdd = cart.getItemInCartNotLogged();
            if (itemToAdd) {
                if (cartComp.checkIfCanAddToCartAndCheckoutNoModals() == true) {
                    var prevStoreId = cart.getChannels();
                    var newStoreId = store.getStoreId();
                    if(prevStoreId != newStoreId) {
                        apiHandler.deleteCart().then(function () {
                            apiHandler.postCartItem(itemToAdd, 1).then(function (data) {
                                cart.setCartDisplay(true);
                                location.reload();
                            })
                        })
                    }else {
                    apiHandler.postCartItem(itemToAdd, 1).then(function (data) {
                        cart.setCartDisplay(true);
                        location.reload();
                    })
                    }
                }
                else {
                    location.reload();
                }
            }
            else {
                location.reload();
            }
        }
        else {
            location.reload();
        }
        cart.removeItemInCartNotLogged();
    },

    checkIfCanAddToCartAndCheckout: function () {
        if (!user.getUserInfo()) {
            modal.openLoginModal();
        }
        else if (store.isSampleStore()) {
            if (!address.getDefaultAddress()) {
                addressComp.showCreateAddressForm();
            }
            else {
                storeComp.showStoreOutOfArea(address.getDefaultAddress(), true);
            }
        }
        else if (store.isStoreClosed()) {
            var storeData = store.getUnavailableStoreInfo();
            storeComp.showStoreClosed(storeData, address.getDefaultAddress(), true);
        }
        else {
            return true;
        }
    },

    checkIfCanAddToCartAndCheckoutNoModals: function () {
        if (!user.getUserInfo()) {
            return false;
        }
        else if (store.isSampleStore() || store.isStoreClosed()) {
            return false;
        }
        else {
            return true;
        }
    },

    updateHeader: function () {
        $('.cart-summary__value').html(this.formatPrice(cart.getTotal()));
    },
    updateCartData: function () {
        //cart items
        $('.cart-items').html(this.createItemsHtml(cart.getItems()));
        $('.cart-items-count').html(cart.getCountItemsQty() + ' items');

        if (cart.canCheckout()) {
            $('.cart-checkout').show();
            $('.cart-checkout-disabled').hide();
            $('.cart-checkout-disabled span').html('');
        } else {
            if (!cart.getItemsTotal() > 0) {
                $('.cart-checkout-disabled span').html('Your cart is empty.');
            }
            else {
                $('.cart-checkout-disabled span').html(cart.getCheckoutMessage());
            }
            $('.cart-checkout-disabled').show();
            $('.cart-checkout').hide();
        }

        cartComp.updateTipAmountWithPercent();
        productComp.validateItemQuantityInit();
    },
    updateCartDataFooter: function () {
        //promo code button
        if (cart.getPromotionTotal() != 0) {
            $('#promo-code-div').html(
                ' <a onclick="modal.openRemovePromoCodeModal()" style="background-color:white; color: #4d4d4d; " class="activate-modal-link cart-btn" data-effect="mfp-zoom-in">' +
                'Promo Code</a>'
            );
        }
        //footer prices
        $('.cart-subtotal')
            .html(this.formatPrice(cart.getItemsTotal()))
            .attr('data-value', cart.getItemsTotal() / 100);
        $('.delivery-fee').html(this.formatPrice(cart.getShippingTotal()));
        $('.tax-total').html(this.formatPrice(cart.getTaxTotal()));
        $('.discount-total').html(this.formatPrice(cart.getPromotionTotal()));
        $('.tip-amount').html(this.formatPrice(cart.getTipTotal()));
        $('.tip-input').val(cartComp.getFormattedTipInputValue());

        $('.cart-total')
            .html(this.formatPrice(cart.getTotal()))
            .attr('data-value', cart.getTotal() / 100);

        //checkout price button:
        $('.checkout-total').html(this.formatPrice(cart.getTotal()));
        app.stopLoading();
        app.stopPageLoading();
    },
    getFormattedTipInputValue: function () {
        var tip = cart.getTipTotal() / 100;
        if (tip == 0) {
            return '0.00';
        }
        else {
            return tip.toFixed(2);
        }
    },
    markProductsInCart: function () {
        var items = cart.getItems();

        if (items) {
            $.each(items, function (key, item) {
                $('.overlay-item-' + item['variant_id'])
                    .html(
                        '<div class="drink-item-qty-controls">' +
                        '<span class="drink-item-qty-count">' + item.quantity + '</span>' +
                        '<button class="drink-item-qty-minus" data-variant-id="' + item.variant_id + '" data-id="' + item.id + '"><span></span></button>' +
                        '<button class="drink-item-qty-plus" data-variant-id="' + item.variant_id + '" data-id="' + item.id + '"><span></span></button></div>'
                    )
                    .addClass('active');
            });
        }
    },
    formatPrice: function (price) {
        price = price / 100;

        return '$' + price.toFixed(2);
    },
    createItemsHtml: function (items) {
        var html = '';
        var cartComp = this;
        if (items) {
            $.each(items, function (key, item) {
                html +=
                    '<article class="cart-item">' +
                    '<div class="cart-item-thumb" style="background-image: url(' + item.image + ')">' +
                    '</div>' +
                    '<div class="cart-item-info">' +
                    '<h2>' + item.name + '</h2>' +
                    '<p>' + cartComp.formatPrice(item.unit_price) + '</p>' +
                    '</div>' +
                    '<div class="cart-item-count">' +
                    '<div class="cart-item-count-count">' +
                    '<span class="cart-item-count-increase item-increase--action" data-variant-id="' + item.variant_id + '" data-id="' + item.id + '"></span>' +
                    '<input type="tel" class="cart-item-quantity item-quantity--action" value="' + item.quantity + '" data-variant-id="' + item.variant_id + '" data-id="' + item.id + '">' +
                    '<span class="cart-item-count-decrease item-decrease--action" data-variant-id="' + item.variant_id + '" data-id="' + item.id + '"></span></div>' +
                    '</div>' +
                    '</article>'
                ;
            });
        }

        return html;
    },
    updateTipAmountWithPercent: function () {
        var tipPercent = $.localStorage.get('tip');
        var tipAmount = (cart.getItemsTotal() * tipPercent / 100).toFixed(2);


        if (tipPercent != null && cart.getTipTotal() != tipAmount) {
            var $tipElement = $(".tip-select").find("[data-value='" + tipPercent + "']");

            if (!$tipElement.hasClass('active')) {
                $tipElement.addClass('active');
            }

            apiHandler.putCartTip(tipAmount);
            cart.setTip(tipAmount * 100);
        }

        cartComp.updateCartDataFooter();
        cartComp.updateHeader();

    },
    changeTipPercent: function () {
        $('body').on('click', '.tip-select a', function () {
            app.startLoading();
            //selected tip effect
            if (!$(this).hasClass('active')) {
                $('.tip-select a').removeClass('active');
                $(this).addClass('active');
            }

            var tipPercent = parseFloat($(this).attr('data-value'));
            $.localStorage.set('tip', tipPercent);

            cartComp.updateTipAmountWithPercent();
        });

    },
    changeTipAmount: function () {
        $('input.tip-input').bind("focusout", function () {
            app.startLoading();
            var tipAmount = $(this).val();
            $.localStorage.set('tip', null);

            $('.tip-select a').removeClass('active');

            apiHandler.putCartTip(tipAmount).then(function (data) {
                cart.setTip(tipAmount * 100);

                cartComp.updateCartDataFooter();
                cartComp.updateHeader();

                app.stopLoading();
            });
        });
    },
    validateTipInput: function () {
        var tip = $('input.tip-input');
        tip.on('keydown', function (e) {
            if (!((e.keyCode > 95 && e.keyCode < 106)
                    || (e.keyCode > 36 && e.keyCode < 58)
                    || e.keyCode == 190 //point
                    || e.keyCode == 8 // backspace
                    || e.keyCode == 13 //enter
                    || e.keyCode == 110 //decimal point
                )) {
                return false;
            }

            var tipValue = tip.val();
            //prevent more then one point
            if ((e.keyCode == 190 || e.keyCode == 110) && tipValue.indexOf('.') != -1) {
                return false;
            }
        });
    },
    incItemQty: function () {
        var cartComp = this;
        $('body').on('click', '.item-increase--action', function () {
            var isCartEmpty = cart.getItemsTotal();
            //if (!user.getUserInfo()) {
            //    modal.openLoginModal();
            //}
            //if(store.isSampleStore() == true) {
            //    addressComp.showCreateAddressForm();
            //}
            if (cartComp.checkIfCanAddToCartAndCheckout() == true) {
                app.startLoading();

                apiHandler.postCartItem($(this).attr('data-variant-id'), 1).then(function (data) {
                    cartComp.afterChangeProductInCart(data);
                    if (isCartEmpty == 0) {
                        cart.setCartDisplay(true);
                    }
                }).fail(function(response){
                    cartComp.handleFailureResponse(response);
                });
            }
        });
    },
    decItemQty: function () {
        var cartComp = this;
        $('body').on('click', '.item-decrease--action', function () {
            if (cartComp.checkIfCanAddToCartAndCheckout() == true) {

                var $parent = $(this).parent().find('.item-quantity--action');
                var quantity = parseInt($parent.val());
                var variantId = $(this).parent().find('.item-increase--action').attr('data-variant-id');
                var cartItemId = $(this).attr('data-id');

                if (quantity == 0) {

                    return;
                }
                app.startLoading();
                if (quantity == 1) {
                    apiHandler.deleteCartItem(cartItemId).then(function (data) {
                        productComp.resetOverlay(variantId);
                        cartComp.afterChangeProductInCart(data);
                    });

                    return;
                }

                apiHandler.patchCartItem(cartItemId, quantity - 1).then(function (data) {
                    cartComp.afterChangeProductInCart(data);
                }).fail(function(response){
                    cartComp.handleFailureResponse(response);
                });
            }
        });
    },
    updateItemQty: function () {
        var cartComp = this;
        var running = 0;
        $('body').on('blur keypress', '.item-quantity--action', function (e) {
            //if not enter or not focusout return
            if (e.which != 13 && e.which != 0) {
                return;
            }
            if (running === 1) {
                running = 0;
                return;
            }
            running = 1;
            var isCartEmpty = cart.getItemsTotal();

            $(this).blur();
            if (cartComp.checkIfCanAddToCartAndCheckout() == true) {
                var quantity = $(this).val();
                var variantId = $(this).attr('data-variant-id');
                var cartItemId = $(this).attr('data-id');

                if (quantity == 0 && !cartItemId) {
                    return;
                }
                app.startLoading();

                if (quantity == 0 && cartItemId) {
                    apiHandler.deleteCartItem(cartItemId).then(function (data) {
                        productComp.resetOverlay(variantId);
                        cartComp.afterChangeProductInCart(data);
                    });

                    return;
                }

                // check if item in cart or adding the product for the first time
                if (cartItemId == '') {
                    apiHandler.postCartItem(variantId, quantity).then(function (data) {
                        cartComp.afterChangeProductInCart(data);
                        if (isCartEmpty == 0) {
                            cart.setCartDisplay(true);
                        }
                    }).fail(function(response){
                        cartComp.handleFailureResponse(response);
                    });
                }
                else {
                    apiHandler.patchCartItem(cartItemId, quantity).then(function (data) {
                        cartComp.afterChangeProductInCart(data);
                    }).fail(function(response){
                        cartComp.handleFailureResponse(response);
                    });
                }

            }
        });

    },

    handleFailureResponse: function(response) {
        var jResponse = response.responseJSON;
        if (response.status === 400 && jResponse.success === false && jResponse.message.length !== 0) {
            $('.max-quantity-cart-title').text(jResponse.message);
            cartComp.updateCartData();
            cartComp.updateCartDataFooter();
            app.stopLoading();
            modal.openMaxQuantityCart();
        }
    },

    displayCart: function () {
        $('.cart-trigger-action').on('click', function (e) {
            e.preventDefault();
            if ($('body').hasClass('cart-active-saved')) {
                $('body').removeClass('cart-active-saved', cart.setCartDisplay(false));
            }
            else if (!$('body').hasClass('cart-active')) {
                $('body').addClass('cart-active', cart.setCartDisplay(true));
            }
            else {
                $('body').removeClass('cart-active-saved');
                $('body').removeClass('cart-active', cart.setCartDisplay(false));
            }
        });
    },
    initCartDisplay: function () {
        var width = $(window).width();
        if (cart.getCartDisplay() == true && width >= 720) {
            $('body').addClass('cart-active-saved');
        }
    },
    afterChangeProductInCart: function (data) {
        cart.setCart(data);
        cartComp.updateHeader();
        cartComp.updateCartData();
        cartComp.markProductsInCart();
        productComp.updateQuantityInModal();

        if ($.magnificPopup.instance.isOpen) {
            var $itemQuantity = $('#modal-drink-item input.item-quantity--action');
            var variantId = $itemQuantity.attr('data-variant-id');
            $itemQuantity.attr('data-id', '');

            //check if variant in cart
            if (data != null) {
                $.each(data['items'], function (cartIndex, cartItem) {
                    if (cartItem.variant_id == variantId) {
                        $itemQuantity.attr('data-id', cartItem['id']);
                        $('#modal-drink-item .item-decrease--action').attr('data-id', cartItem['id']);
                        $('#modal-drink-item .item-increase--action').attr('data-id', cartItem['id']);
                    }
                });

                app.stopLoading();

                return;
            }
        }
    },
    initTipInput: function () {
        $('input.tip-input').on('click', function () {
            $(this).select();
        })
    },
    couponClick: function () {
        $('form#promo-code').on('submit', function (e) {
            e.preventDefault();
            app.startLoading();
            apiHandler.putCartCoupon($('#_promo_code').val()).then(function () {
                apiHandler.getCart().then(function (data) {
                    if (data.promotion_total == 0) {
                        app.displaySingleFormError($("#promo-code"), 'This promo code is not valid.');
                        app.stopLoading();
                    } else {
                        location.reload();
                    }
                });
            });
        })
    },
    couponRemoveClick: function () {
        $('form#promo-code-remove').on('submit', function (e) {
            e.preventDefault();
            app.startLoading();
            apiHandler.putCartCoupon(" ").then(function () {
                    location.reload();
            });
        })
    }
};





