var packComp = {
    increaseElement: '#modal-pack .pack-increase--action',
    decreaseElement: '#modal-pack .pack-decrease--action',
    quantityElement: '#modal-pack input.pack-quantity--action',
    submitElement: '#modal-pack .modal-pack-submit',
    init: function () {
        this.addPackToCart();
        this.increasePackItemQuantity();
        this.decreasePackItemQuantity();
        this.changePackItemQuantity();
        this.updatePackTotal();
        this.addPackToCartNotLogged();
        this.validatePackQuantity();
    },
    setCartVariants: function(){
        $('body').on('click', '.activate-modal-link[href="#modal-pack"]', function(){
            var userSelectedVariants = [];
            $('.slick-current.slick-active .drink-item-top .activate-modal-link[href="#modal-drink-item"]').each(function(){
                var dataItem = {
                    'image':$(this).next().next().css('background-image'),
                    'presentation':$(this).parent('.drink-item-top').next().children('.product-variant-presentation').text(),
                    'price':$(this).parent('.drink-item-top').next().children('.product-variant-price').text(),
                    'text':$(this).parent('.drink-item-top').next().children('.product-variant').children('p').last().text()
                };
                userSelectedVariants.push({
                    'id':$(this).data('variant-id'),
                    'data':dataItem
                });
            });
            $('.pack-cart-item.cart-item').each(function(indx, item){
                if (userSelectedVariants[indx].id !== parseInt($(item).attr('data-id'))) {
                    $(item).attr('data-id', userSelectedVariants[indx].id)
                            .children('div.cart-item-thumb').css('background-image', userSelectedVariants[indx].data.image)
                            .next().children('h2').text(userSelectedVariants[indx].data.presentation)
                            .next().attr('data-price', userSelectedVariants[indx].data.price).text(userSelectedVariants[indx].data.text);
                    $(item).children('cart-item-count').children('div').children('span.cart-item-count-increase').attr('data-price', userSelectedVariants[indx].data.price)
                            .next().next().attr('data-price', userSelectedVariants[indx].data.price);
                    packComp.updatePackTotal();
                }
            });
        });
    },
    addPackToCart: function () {
        $('body').on('click', '.modal-pack-submit', function () {
            if (cartComp.checkIfCanAddToCartAndCheckout() == true) {
                var isCartEmpty = cart.getItemsTotal();
                app.startLoading();
                var packId = $(this).attr('data-id');
                var items = [];
                //get all items from pack
                $('.pack-cart-item').each(function (index, obj) {
                    var variantId = $(this).attr('data-id');
                    var quantity = $(this).find('.pack-quantity--action').val();
                    if (parseInt(quantity) > 0) {
                        items.push({
                            'variant': parseInt(variantId),
                            'quantity': parseInt(quantity)
                        });
                    }
                });

                var data = {
                    'package': packId,
                    'channel': store.getStoreId(),
                    'items': items
                };

                //add to cart
                apiHandler.addPackToCart(data).then(function (data) {
                    cart.setCart(data);
                    cartComp.updateHeader();
                    cartComp.updateCartData();
                    cartComp.markProductsInCart();
                    if (isCartEmpty == 0) {
                        cart.setCartDisplay(true);
                        $('body').addClass('cart-active');
                    }
                    $.magnificPopup.instance.close();
                    app.stopLoading();
                }).fail(function(response){
                    cartComp.handleFailureResponse(response);
                });

            }
        });
    },
    addPackToCartNotLogged: function () {
        $('.pack-add-to-cart-not-logged--action').on('click', function () {
            var packId = $(this).attr('data-id');
            var items = [];
            //get all items from pack
            $('.pack-cart-item').each(function (index, obj) {
                var variantId = $(this).attr('data-id');
                var quantity = $(this).find('.pack-quantity--action').val();
                if (parseInt(quantity) > 0) {
                    items.push({
                        'variant': parseInt(variantId),
                        'quantity': parseInt(quantity)
                    });
                }
            });

            var data = {
                'package': packId,
                'channel': store.getStoreId(),
                'items': items
            };

            cart.setPackInCartNotLogged(data);
        })
    },
    addPackToCartAfterLogin: function () {
        var deferred = jQuery.Deferred();
        if (user.getUserInfo()) {
            var data = cart.getPackInCartNotLogged();
            if (data) {
                var prevStoreId = cart.getChannels();
                var newStoreId = store.getStoreId();
                if (prevStoreId != newStoreId) {
                    apiHandler.deleteCart().then(function () {
                        apiHandler.addPackToCart(data).then(function (data) {
                            cart.setCart(data);
                            cart.setCartDisplay(true);
                            deferred.resolve('ok');
                        })
                    });
                } else {
                    apiHandler.addPackToCart(data).then(function (data) {
                        cart.setCart(data);
                        cart.setCartDisplay(true);
                        deferred.resolve('ok');
                    })
                }
            }
            else {
                deferred.resolve('no data');
            }
        }
        else {
            deferred.resolve('no user');
        }
        cart.removePackInCartNotLogged();
        return deferred.promise();
    },
    increasePackItemQuantity: function () {
        $(this.increaseElement).on('click', function () {
            var quantity = $(this).next(this.quantityElement).val();
            $(this).next(this.quantityElement).val(parseInt(quantity) + 1);

            packComp.updatePackTotal();
        });
    },
    decreasePackItemQuantity: function () {
        $(this.decreaseElement).on('click', function () {
            var quantity = $(this).prev(this.quantityElement).val();
            if (parseInt(quantity) > 0) {
                $(this).prev(this.quantityElement).val(parseInt(quantity) - 1);
                packComp.updatePackTotal();
            }
        });
    },
    changePackItemQuantity: function () {
        $(this.quantityElement).on('keyup', function () {
            packComp.updatePackTotal();
        });
    },
    updatePackTotal: function () {
        var totalPrice = 0;
        var totalItems = 0;

        //calculate totals
        $('.pack-cart-item').each(function (index, obj) {
            var price = $(this).find('p.pack-item-price--action').attr('data-price');
            var quantity = $(this).find('.pack-quantity--action').val();
            if (parseInt(quantity) > 0) {
                totalPrice += parseInt(price) * parseInt(quantity);
                totalItems += parseInt(quantity);
            }
        });

        //update totals
        $(this.submitElement).attr('data-price', totalPrice);
        $(this.submitElement + ' span.pack-total--action').html(app.formatPrice(totalPrice));
        $(this.submitElement + ' span.pack-items-quantity--action').html(totalItems);
    },
    validatePackQuantity: function () {
        var quantity = $('.pack-quantity--action');

        quantity.on('keydown', function (e) {
            if (!((e.keyCode > 95 && e.keyCode < 106)
                || (e.keyCode > 47 && e.keyCode < 58)
                || e.keyCode == 8
                || e.keyCode == 13 )) {
                return false;
            }
        });
    }

};

