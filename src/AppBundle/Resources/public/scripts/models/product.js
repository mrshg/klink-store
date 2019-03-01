var product = {

    populateProductModal: function (productName, storeId, packageItems) {
        app.startLoading();
        if (typeof(fbq) == "function") {
            fbq('track', 'ViewContent');
        }
        $('#modal-drink-item').hide();
        var productData = {
            name: productName,
            stores: [store.getStoreId()]
        };
        if (packageItems != null && storeId != null && store.getStoreId() != storeId) {
            productData['stores'] = [storeId];
            productData['mainStore'] = store.getStoreId();
            productData['packageItems'] = packageItems;
        }

        apiHandler.getProducts(productData).then(function (data) {
            if (data.length != 0) {
                if (!data['items']) {

                    // if item wasn't found in current store, use store from url param
                    if(storeId != null) {
                        productData['stores'] = [storeId];
                        apiHandler.getProducts(productData).then(function (data) {
                            if (!data['items']) {
                                app.stopLoading();
                                $.magnificPopup.instance.close();
                                return false;
                            }

                            var item = data['items'][0];

                            product.populateProductModalWithSampleItem(item);
                        });
                    }
                    else {
                        app.stopLoading();
                        $.magnificPopup.instance.close();
                        return false;
                    }
                }
                else {
                    var item = data['items'][0];

                    product.populateProductModalWithItem(item);
                }
            }
        }).fail(function(){
        });
    },
    populateProductModalWithSampleItem: function(item) {
        $('#modal-drink-item .modal__title').html(item.name);
        $('#modal-drink-item .read-more').html(item.description);
        this.loadModalImage(item);

        //hide prices and show message
        $('#modal-drink-item .drink-pack-amount').html('Product is currently unavailable in this store.');
        $('#modal-drink-item .drink-pack-quantity').hide();
        $('#modal-drink-item .modal__drink-data').show();

        $('#modal-drink-item').show();
        app.stopLoading();
    },

    loadModalImage: function(item) {
        var img = new Image();
        img.onload = function () {
            $('#modal-drink-item .modal__drink-img').html('<img src="' + item.image + '" alt="' + item.masterVariant.presentation + '" width=140 height=200>');
        };
        img.onerror = function(){
            $('#modal-drink-item .modal__drink-img').html('<img src="' + api.assetUrl + 'assets/dist/img/drink-no-image.jpg" alt="' + item.masterVariant.presentation + '" width=140 height=200>');
        };
        img.src = item.image;
    },

    populateProductModalWithItem: function(item) {
            $('#modal-drink-item .modal__title').html(item.name);
            $('#modal-drink-item .read-more').html(item.description);
            this.loadModalImage(item);

            if (store.isSampleStore() != true) {
                $('#modal-drink-item .drink-price').html(cartComp.formatPrice(item.variants[1].price));
            }
            $('#modal-drink-item button.btn-plus').attr('data-variant-id', item.variants[1].id);

            // POPULATE VARIANTS

            //populate buttons
            var buttons = '';
            var $itemQuantity = $('#modal-drink-item input.item-quantity--action');
            $.each(item.variants, function (index, variant) {
                $itemQuantity.val('0');
                $itemQuantity.attr('data-variant-id', item.variants[1].id);
                $itemQuantity.attr('data-id', '');

                //check if variant in cart
                if (user.getUserInfo()) {
                    var cartData = cart.getCart();
                    if (cartData != null) {
                        $.each(cartData['items'], function (cartIndex, cartItem) {
                            if (cartItem.variant_id == item.variants[1].id) {
                                $itemQuantity.val(cartItem['quantity']);
                                $itemQuantity.attr('data-id', cartItem['id']);
                                $itemQuantity.attr('data-variant-id', cartItem['variant_id']);
                                $('#modal-drink-item .item-decrease--action').attr('data-id', cartItem['id']);
                                $('#modal-drink-item .item-increase--action').attr('data-id', cartItem['id']);
                            }
                        });
                    }
                }

                var buttonName = '%packSize% %volume% %containerType%';
                var options = variant.options;
                for (var i = 0; i < options.length; i++) {
                    if (options[i].name === "Pack size") {
                        buttonName = buttonName.replace('%packSize%', options[i].value + '-Pack');
                    } else if (options[i].name === "Volume") {
                        buttonName = buttonName.replace('%volume%', options[i].value);
                    } else if (options[i].name === "Container type") {
                        buttonName = buttonName.replace('%containerType%', options[i].value + 's');
                    }
                }
                buttonName = buttonName.replace('%packSize%', '');
                buttonName = buttonName.replace('%volume%', '');
                buttonName = buttonName.replace('%containerType%', '');
                buttonName = buttonName.replace('  ', ' ');
                buttonName = buttonName.trim();

                buttons += '<button data-id="' + variant.id + '" data-price="' + variant.price + '" class="switch-variant--action">' + buttonName + '</button>';

            });

            $('#modal-drink-item .drink-pack-amount').html(buttons);
            $('#modal-drink-item .drink-pack-amount button:first-child').addClass('active');
            $('#modal-drink-item .modal__drink-data').show();
            $('#modal-drink-item .drink-pack-quantity').show();


        $('#modal-drink-item').show();
        app.stopLoading();
    }
};
