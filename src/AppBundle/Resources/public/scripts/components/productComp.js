var productComp = {
    init: function () {
        this.addFirstToCart();
        this.incFromCart();
        this.decFromCart();
        //this.loadMoreProducts();
        this.loadProductsByCategories();
        this.searchAutoComplete();
    },
    addFirstToCart: function () {
        $('body').on('click', '.drink-item-overlay a.drink-item-add-first', function () {
            if (typeof(fbq) == "function") {
                fbq('track', 'AddToCart');
            }
            if(cartComp.checkIfCanAddToCartAndCheckout() == true) {
                var isCartEmpty = cart.getItemsTotal();
                app.startLoading();
                var variantId = $(this).attr('data-id');
                var productElement = $(this);

                apiHandler.postCartItem(variantId, 1).then(function (data) {
                    cart.setCart(data);
                    cartComp.updateHeader();
                    cartComp.updateCartData();
                    cartComp.markProductsInCart();
                    if(isCartEmpty == 0) {
                        cart.setCartDisplay(true);
                    }

                    productElement.parent().replaceWith(
                        '<div class="drink-item-overlay active">' +
                        '<div class="drink-item-qty-controls">' +
                        '<span class="drink-item-qty-count">' + 1 + '</span>' +
                        '<button class="drink-item-qty-minus" data-id="' + variantId + '"><span></span></button>' +
                        '<button class="drink-item-qty-plus" data-id="' + variantId + '"><span></span></button></div>' +
                        '</div>'
                    );

                    app.stopLoading();
                })
            }
        });
    },
    incFromCart: function () {
        $('body').on('click', '.drink-item-overlay button.drink-item-qty-plus', function () {
            app.startLoading();
            var count = $(this).parent().find('.drink-item-qty-count');

            apiHandler.postCartItem($(this).attr('data-variant-id'), 1).then(function (data) {
                cart.setCart(data);
                cartComp.updateHeader();
                cartComp.updateCartData();
                cartComp.markProductsInCart();

                count.html(parseInt(count.html()) + 1);

                app.stopLoading();
            });
        });
    }
    ,
    decFromCart: function () {
        var productComp = this;

        $('body').on('click', '.drink-item-overlay button.drink-item-qty-minus', function () {
            app.startLoading();

            var count = $(this).parent().find('.drink-item-qty-count');
            var quantity = parseInt(count.html());
            var variantId = $(this).attr('data-variant-id');
            var cartItemId = $(this).attr('data-id');

            if (quantity == 1) {
                apiHandler.deleteCartItem(cartItemId).then(function (data) {
                    cart.setCart(data);
                    cartComp.updateHeader();
                    cartComp.updateCartData();
                    cartComp.markProductsInCart();

                    productComp.resetOverlay(variantId);

                    app.stopLoading();
                });

                return;
            }

            apiHandler.patchCartItem(cartItemId, quantity - 1).then(function (data) {
                cart.setCart(data);
                cartComp.updateHeader();
                cartComp.updateCartData();
                cartComp.markProductsInCart();

                count.html(parseInt(quantity - 1));

                app.stopLoading();
            });

        });
    },
    resetOverlay: function (variantId) {
        $('.overlay-item-' + variantId).html(
            '<a class="drink-item-add-first" data-id="' + variantId + '">' +
            '<span class="add-drink-to-cart" data-id="' + variantId + '"></span>' +
            '</a>'
        ).removeClass('active');
    },
    loadMoreProducts: function () {
        var productComp = this;

        // get all selected categories
        var categories = [];
        $('.browse-drinks-filters li.active').each(function () {
            categories.push($(this).children('a').attr('data-id'));
        });

        if (categories.length == 0) {
            $('li.browse-drinks-category.active').each(function () {
                categories.push($(this).attr('data-id'));
            });
        }

        productComp.loadProductsAjax(categories, false);

    },
    loadProductsByCategories: function () {
        var productComp = this;

        $('.browse-drinks-all').on('click', function() {
            app.startLoading();
            $('.drink-list').html('');
            $('.load-more').remove();

            if(!$(this).hasClass('active')) {
               $(this).addClass('active');
            }

            $('.browse-drinks-filters li.active').removeClass('active');

            var categories=[];
            $('li.browse-drinks-category.active').each(function () {
                categories.push($(this).attr('data-id'));
            });

            productComp.loadProductsAjax(categories, true);
        });

        $('.browse-drinks-filters li').on('click', function () {
            app.startLoading();

            $('.browse-drinks-all').removeClass('active');

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
            else {
                $(this).addClass('active');
            }

            $('.drink-list').html('');
            $('.load-more').remove();

            // get all selected categories
            var categories = [];
            $('.browse-drinks-filters li.active').each(function () {
                categories.push($(this).children('a').attr('data-id'));
            });

            if (categories.length == 0) {
                $('li.browse-drinks-category.active').each(function () {
                    categories.push($(this).attr('data-id'));
                });
            }

            productComp.loadProductsAjax(categories, true);
        });
    },
    loadProductsAjax: function (categories, resetPage) {
        var data = {
            'categories': categories,
            'stores': store.getStoreIds(),
            'page': 1
        };

        if (!resetPage) {
            data.page = app.getNextPage();
        }

        if(app.urlParam('search-term')) {
            data.name = app.urlParam('search-term');
        }

        var pageNum = data.page;

        $.ajax({
                method: 'GET',
                url: api.assetUrl + 'ajax/products/filter/',
                data: data
            })
            .done(function (data) {
                if (data.hasMore && resetPage) {
                    app.resetPage();
                }

                if (!data.hasMore) {
                    $('.load-more').remove();
                }

                $('.drinks-data-slider').slick('unslick');
                $('.drink-list').append(data.contentHtml);
                app.scrolled = false;
                initDrinkDataSlider();

                cartComp.markProductsInCart();
                $('body .activate-modal-link.page'+pageNum).magnificPopup(modalOptions);

                app.stopLoading();
            });
    },
    updateQuantityInModal: function() {
        var items = cart.getItems();

        $('#modal-drink-item input.item-quantity--action').val(0);

        if (items) {
            $.each(items, function (key, item) {
                var variantId = $('#modal-drink-item .item-increase--action').attr('data-variant-id');
                if(item['variant_id'] == variantId) {
                    $('#modal-drink-item input.item-quantity--action').val(item['quantity']);
                    $('#modal-drink-item .item-decrease--action').attr('data-id', item['id']);
                }
            });
        }
    },

    searchAutoComplete: function () {
        $('input#search-terms').autocomplete({
            source: function (request, response) {
                var name = request.term;
                var searchData = {
                    name: name,
                    stores: [store.getStoreId]
                };

                apiHandler.getProducts(searchData).then(function (data) {
                    var productNames = [];
                    $.each(data.items, function(key, item) {
                        productNames.push(item.name);
                    });

                    response(productNames);
                })
            },
            minLength: 2,
            appendTo: $('.search-form-wrapper')
        });
    },
    validateItemQuantityInit: function () {
        var quantity = $('body input.item-quantity--action');

        quantity.on('keydown', function (e) {
            if (!((e.keyCode > 95 && e.keyCode < 106)
                || (e.keyCode > 47 && e.keyCode < 58)
                || e.keyCode == 8
                || e.keyCode ==13 )) {
                return false;
            }
        });
    }

};

productComp.init();

//switch variant in modal
$('body').on('click', '#modal-drink-item .drink-pack-amount button', function () {
    var price = app.formatPrice($(this).attr('data-price'));
    var variantId = $(this).attr('data-id');

    if (store.isSampleStore() != true) {
        $('#modal-drink-item .drink-price').html(price);
    }

    $('#modal-drink-item input.item-quantity--action').val(0);
    $('#modal-drink-item .item-increase--action').attr('data-variant-id', variantId);
    $('#modal-drink-item .drink-pack-amount button.active').removeClass('active');
    $(this).addClass('active');

    productComp.updateQuantityInModal();


});
