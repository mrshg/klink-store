var addressComp = {
    $suggestAddressNotLoggedIn: $('#input-address-field-not-logged-in'),
    $suggestAddressLoggedIn: $('#input-address-field-logged-in'),
    $overlay: $('.page-wrap'),

    init: function () {
        this.setSelectedAddressDefault();
        this.submitNewAddress();
        this.suggestAddress();
        this.submitAddress();
        this.deleteAddress();
        this.getCurrentLocation();
        this.populateUpdateAddressModal('#modal-update-address');
        //this.updateHeader();
    },

    showCreateAddressForm: function () {
        modal.openChangeAddressInitModal();
    },
    updateHeader: function () {
        var defaultAddress = $.localStorage.get('defaultAddress');
        if (defaultAddress) {
            if (store.isSampleStore()) {
                $('.header-customer-address').html(
                    '<a class="nav-address__trigger" id="addAddress" href="#"> ' +
                    '<div class="header-customer-address-container"> ' +
                    '<span>' +
                    '<strong>CHANGE ADDRESS</strong><br>' +
                    'Browsing a sample inventory ' +
                    '</span> ' +
                    '<i class="icon icon-address-location" data-icon="r"></i>' +
                    '</div> ' +
                    '</a>'
                );
            }
            else {
                $('span.header-address--action').html(address.__toHtml(defaultAddress));
                if ($('.header-customer-address-container').find('i.icon-address-location').length == 1) {
                    $('.header-customer-address-container').append('<i class="icon icon-address-location" data-icon="r"></i>');
                }
                $('#map').html('<img src="https://maps.googleapis.com/maps/api/staticmap?zoom=17&autoscale=2&size=300x250&maptype=roadmap&key=AIzaSyAKkJMIYxEv8IV9Eoshxc4U8uDYKKPO97A&format=png&visual_refresh=true&markers=icon:http://i.imgur.com/dZttCtd.png|shadow:true|' + address.__toString(defaultAddress) + '">');
                $('.store-hours__map-bg').html('<img src="https://maps.googleapis.com/maps/api/staticmap?zoom=17&autoscale=2&size=300x250&maptype=roadmap&key=AIzaSyAKkJMIYxEv8IV9Eoshxc4U8uDYKKPO97A&format=png&visual_refresh=true&markers=icon:http://i.imgur.com/dZttCtd.png|' + address.__toString(defaultAddress) + '">');
            }
        }
        else {
            $('.header-customer-address').html(
                '<a class="nav-address__trigger" id="addAddress" href="#"> ' +
                '<div class="header-customer-address-container"> ' +
                '<span>' +
                '<strong>ENTER YOUR ADDRESS</strong><br>' +
                'to see drinks and prices available to your area ' +
                '</span> ' +
                '<i class="icon icon-address-location" data-icon="r"></i>' +
                '</div> ' +
                '</a>'
            );
        }
    },
    showCreateAddressFormNotLoggedUser: function () {
        var defaultAddress = $.localStorage.get('defaultAddress');
        var addressPopupShow = $.localStorage.get('addressPopupShow');
        $(document).ready(function () {
            if (defaultAddress == null && addressPopupShow == null) {
                addressComp.showCreateAddressForm();

                $.localStorage.set('addressPopupShow', true);
            }
        });
    },
    showCreateAddressFormIfNotExist: function () {
        var addressPopupShow = $.localStorage.get('addressPopupShow');

        apiHandler.getUserDefaultAddress().then(function (data) {
            if (data.length == 0 && addressPopupShow == null) {
                modal.openUpdateAddressModal();

                $.localStorage.set('addressPopupShow', true);

            }

        }).fail(function () {
            if (addressPopupShow == null) {
                modal.openUpdateAddressModal();
                $.localStorage.set('addressPopupShow', true);
            }
        });

    },
    getCurrentLocation: function () {
        var locationElement = $('.get-current-location--action');
        if (navigator.geolocation) {
            locationElement.on('click', function () {
                app.startLoading();
                setTimeout(function () {
                    app.stopLoading();
                }, 5000); // for Not now in Fire fox
                navigator.geolocation.getCurrentPosition(function (position) {
                    var data = {
                        'latitude': position.coords.latitude,
                        'longitude': position.coords.longitude
                    };

                    address.setLatitudeAndLongitude(data.latitude, data.longitude);

                    apiHandler.getGeocodeReverse(data).then(function (data) {
                        var address = data.street + ', ' + data.locality + ', ' + data.administrative_area + ' ' + data.postal_code + ', ' + data.country_code;
                        $('.input-address-field').val(address);
                        app.stopLoading();
                    });
                }, function () {
                    $('.current-location span.location-error').remove();
                    $('.current-location').append('<span class="location-error" style="color:darkred"><br>We were unable to get your current location.</span>');
                    app.stopLoading();
                });
            });

            return;
        }

        locationElement.remove();
    },
    submitAddress: function () {
        $('button.submit-new-setup-address--action').on('click', function () {
            app.startLoading();
            var addressData = {
                'address': $('input.input-address-field').val()
            };

            apiHandler.getGeocode(addressData).then(function (data) {
                var longLat = {
                    'latitude': data.latitude,
                    'longitude': data.longitude
                };

                apiHandler.getGeocodeReverse(longLat).then(function (data) {
                    data['address_line1'] = data['street'];
                    var addressObj = data;

                    apiHandler.getStores(longLat).then(function (data) {
                        if (data['unavailable'].length) {
                            storeComp.showStoreClosed(data['unavailable'][0], addressObj, false);
                        }
                        else if (!data['unavailable'].length && !data['available'].length) {
                            storeComp.showStoreOutOfArea(addressObj, false);
                        }
                        else if (data['available'].length) {
                            addressComp.showAddressCheck(addressObj);
                        }
                        app.stopLoading();
                    });
                });
            });


        });

        return false;
    },

    prepareAddressFormat: function (data, addressId) {
        addressId = addressId || null;
        var addressObj = {};
        if (data['street']) {
            addressObj['addressLine1'] = data['street'];
            addressObj['locality'] = data['locality'];
            addressObj['administrativeArea'] = data['country_code'] + '-' + data['administrative_area'];
            addressObj['postalCode'] = data['postal_code'];
            addressObj['countryCode'] = data['country_code'];

            return addressObj;
        }
        else if (data['additionalInformation'] || data['additionalInformation'] == '') {
            address.setAdditionalInfo(data['additionalInformation'], addressId);

            addressObj['addressLine1'] = data['addressLine1'];
            addressObj['addressLine2'] = data['addressLine2'];
            addressObj['locality'] = data['locality'];
            addressObj['administrativeArea'] = data['administrativeArea'];
            addressObj['postalCode'] = data['postalCode'];
            addressObj['countryCode'] = data['country_code'];

            return addressObj;
        }
        else if (data['address_line1']) {
            addressObj['addressLine1'] = data['address_line1'];
            if (data['address_line2']) {
                addressObj['addressLine2'] = data['address_line2'];
            }
            addressObj['locality'] = data['locality'];
            addressObj['administrativeArea'] = data['administrative_area'];
            addressObj['postalCode'] = data['postal_code'];
            addressObj['countryCode'] = data['country_code'];

            return addressObj;
        }

        return data;
    },

    suggestAddress: function () {
        this.$suggestAddressNotLoggedIn.autocomplete({
            source: function (request, response) {
                var address = request.term;
                var addressData = {
                    address: address
                };

                apiHandler.getAddressSuggestions(addressData).then(function (data) {

                    response(data['suggestions']);
                })
            },
            minLength: 2,
            appendTo: $('.address-input-not-logged-in .ui-widget')
        });

        this.$suggestAddressLoggedIn.autocomplete({
            source: function (request, response) {
                var address = request.term;
                var addressData = {
                    address: address
                };

                apiHandler.getAddressSuggestions(addressData).then(function (data) {

                    response(data['suggestions']);
                })
            },
            minLength: 2,
            appendTo: $('.address-input .ui-widget')
        });

    },

    setSelectedAddressDefault: function () {
        $('body').on('click', 'button.set-default-address', function () {
            var addressId = $(this).attr('data-id');

            storeComp.isDifferentStoreById(addressId).then(function (isDifferentStore) {

                if (isDifferentStore) {
                    modal.openDeleteCartConfirm().then(function () {
                        addressComp.setSelectedAddressDefaultConfirmed(addressId);
                    });
                }

                else {
                    addressComp.setSelectedAddressDefaultConfirmed(addressId);
                }
            });
        });
    },

    setSelectedAddressDefaultConfirmed: function (addressId) {
        app.startLoading();

        var data = {
            'id': addressId
        };

        apiHandler.patchUserDefaultAddress(data).then(function () {
            $('.btn--is-chosen').removeClass('active btn--is-chosen').addClass('set-default-address');
            $.localStorage.set('showStoreClosed', false);
            $.localStorage.set('showStoreOutOfArea', false);
            $.each(user.getAddresses(), function (key, addressData) {
                if (addressData['id'] == addressId) {
                    var geoData = {
                        address: address.__toString(addressData)
                    };
                    apiHandler.getGeocode(geoData).then(function (data) {
                        store.init(data, true);
                    })
                }
            });
        });
    },

    submitNewAddress: function () {
        var $newAddressForm = $('form#new-address-form');
        $newAddressForm.on('submit', function (e) {
            e.preventDefault();
            var postData = $newAddressForm.serialize();
            storeComp.isDifferentStoreByString(address.__toString($newAddressForm.serializeObject())).then(function (isDifferentStore) {
                if (isDifferentStore) {
                    modal.openDeleteCartConfirm().then(function () {
                        addressComp.submitNewAddressConfirmed(postData);
                    });
                }
                else {
                    addressComp.submitNewAddressConfirmed(postData);
                }
            });
        });
    },
    submitNewAddressConfirmed: function (address) {
        app.startLoading();
        var $newAddressForm = $('form#new-address-form');
        apiHandler.postUserAddresses(address).then(function (data) {
            apiHandler.patchUserDefaultAddress(data).then(function (data) {
                $.localStorage.set('showStoreClosed', false);
                $.localStorage.set('showStoreOutOfArea', false);

                var geoData = {
                    address: address.__toString(data)
                };
                apiHandler.getGeocode(geoData).then(function (data) {
                    store.init(data, true);
                });
            });

        }).fail(function () {
            app.stopLoading();
            modal.openAddAddress();
            app.displaySingleFormError($newAddressForm, 'Please enter valid ZIP code.'); //api returns error only for zip code
        });
    },
    generateHtmlForCardList: function (address) {
        var addressLine2 = '';
        if (address.address_line2) {
            addressLine2 = address.address_line2;
        }

        var mapImage = 'style="background-image: url(\'https://maps.googleapis.com/maps/api/staticmap?autoscale=2&size=400x450&maptype=roadmap&key=AIzaSyAKkJMIYxEv8IV9Eoshxc4U8uDYKKPO97A&format=png&visual_refresh=true&markers=icon:http://i.imgur.com/dZttCtd.png|' + address.address_line1 + '+' + addressLine2 + '+' + address.locality + '+' + address.country_code + '+' + address.postal_code + '\')"';

        var html = ' <article class="address-item">' +
            '<div class="map-source" ' + mapImage + '></div>' +
            '<div class="map-blur" ' + mapImage + '></div>' +
            '<div class="address-item__data">' +
            ' <address>';

        if (addressLine2) {
            html += addressLine2 + '<br/>';
        }

        html += address.country_code + ' ' + address.locality + ' ' + address.postal_code +
            '</address>' +
            '<div class="address-item__actions">' +
            '<div class="btn-group">' +
            '<button type="button" class="btn btn--white" data-id="' + address.id + '">' +
            'Default' +
            '</button>' +
            '<a href="#modal-edit-address" class="btn btn--white activate-modal-link"' +
            'data-effect="mfp-zoom-in" data-id="' + address.id + '">Edit</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</article>';

        return html;
    },
    showAddressCheck: function (addressObj) {
        var address = [];

        this.populateAddressCheckModal(addressObj);
        $('#modal-verify-address').addClass('active');

        //$('#initial-address-setup-notlogged').removeClass('active');
        modal.openVerifyAddressModal();
    },
    populateAddressCheckModal: function (addressObj) {
        $('.save-address').attr('data-address', JSON.stringify(addressObj));

        $('#modal-verify-address .map').html('<img src="https://maps.googleapis.com/maps/api/staticmap?autoscale=2&size=450x250&maptype=roadmap&key=AIzaSyAKkJMIYxEv8IV9Eoshxc4U8uDYKKPO97A&format=png&visual_refresh=true&markers=icon:http://i.imgur.com/dZttCtd.png|' + address.__toString(addressObj) + '">');

        //populate address
        $('#modal-verify-address .modal__header-info').html(address.__toHtml(addressObj));
    },
    saveAddress: function ($saveAddress) {
        if ($saveAddress.attr('data-close-modal') == 'true') {
            $.magnificPopup.close();
        }
        else {
            var addressObj = JSON.parse($saveAddress.attr('data-address'));

            storeComp.isDifferentStoreByString(address.__toString(addressObj)).then(function (isDifferentStore) {
                if (isDifferentStore) {
                    modal.openDeleteCartConfirm().then(function () {
                        addressComp.saveAddressConfirmed(addressObj);
                    });
                }
                else {
                    addressComp.saveAddressConfirmed(addressObj);
                }
            });
        }
    },

    saveAddressConfirmed: function (addressObj) {
        app.startLoading();
        address.setDefaultAddress(addressObj);
        $.localStorage.set('showStoreClosed', false);
        $.localStorage.set('showStoreOutOfArea', false);

        var geoCodeData = {
            address: address.__toString(addressObj)
        };

        //change store
        apiHandler.getGeocode(geoCodeData).then(function (data) {
            var longLat = {
                'latitude': data.latitude,
                'longitude': data.longitude
            };

            store.init(longLat, true);
        });
    },

    populateEditAddressModal: function (addressId, modalId) {
        apiHandler.getUserAddress(addressId).then(function (data) {
            $(modalId + ' input#addressLine1').val(data['address_line1']);
            $(modalId + ' input#addressLine2').val(data['address_line2']);
            $(modalId + ' select#administrativeArea').val(data['administrative_area']);
            $(modalId + ' input#locality').val(data['locality']);
            $(modalId + ' input#postalCode').val(data['postal_code']);
            $(modalId + ' form#edit-address-form').attr('data-id', addressId);

            if (address.getAdditionalInfo(addressId)) {
                $(modalId + ' textarea#additionalInformation').val(address.getAdditionalInfo(addressId));
            }
            else {
                $(modalId + ' textarea#additionalInformation').val('');
            }
        });
    },
    populateEditAddressCheckoutModal: function (addressId, modalId) {
        apiHandler.getUserAddress(addressId).then(function (data) {
            $(modalId + ' input#addressLine1').val(data['address_line1']);
            $(modalId + ' input#addressLine2').val(data['address_line2']);
            $(modalId + ' select#administrativeArea').val(data['administrative_area']);
            $(modalId + ' input#locality').val(data['locality']);
            $(modalId + ' input#postalCode').val(data['postal_code']);
            $(modalId + ' form#edit-address-form-checkout').attr('data-id', addressId);

            if (address.getAdditionalInfo(addressId)) {
                $(modalId + ' textarea#additionalInformation').val(address.getAdditionalInfo(addressId));
            }
            else {
                $(modalId + ' textarea#additionalInformation').val('');
            }
        });
    },
    populateUpdateAddressModal: function (modalId) {
        if (user.getUserInfo()) {
            var addresses = address.getUserAddresses();
            $(modalId + ' .address-list ul').html('');
            var defaultAddress = address.getDefaultAddress();

            if (addresses != null) {
                $.each(addresses, function (key, addressData) {
                    var html = '<li><label for="savedAddress' + addressData.id + '">' + address.__toHtml(addressData) + '</label>';
                    html += '<input type="radio" name="deliveryaddress" class="saved-address--action" data-id="' + addressData.id + '" id="savedAddress' + addressData.id + '" /></li>';
                    if (addressData.id == defaultAddress.id) {
                        $(modalId + ' .address-list ul').prepend(html);
                    }
                    else {
                        $(modalId + ' .address-list ul').append(html);
                    }
                });
            }
        }
    },
    populateDeleteAddressModal: function (addressId) {
        $('#modal-delete-address .delete-address--action').attr('data-id', addressId);
    },
    updateToSavedAddress: function (id) {
        storeComp.isDifferentStoreById(id).then(function (isDifferentStore) {
            if (isDifferentStore) {
                modal.openDeleteCartConfirm().then(function () {
                    addressComp.updateToSavedAddressConfirmed(id);
                });
            }
            else {
                addressComp.updateToSavedAddressConfirmed(id);
            }
        });
    },

    updateToSavedAddressConfirmed: function (id) {
        app.startLoading();
        var data = {
            'id': id
        };

        apiHandler.patchUserDefaultAddress(data).then(function () {
            //get new address data from id
            $.localStorage.set('showStoreClosed', false);
            $.localStorage.set('showStoreOutOfArea', false);
            $.each(user.getAddresses(), function (key, addressData) {
                if (addressData['id'] == id) {
                    var geoData = {
                        address: address.__toString(addressData)
                    };
                    apiHandler.getGeocode(geoData).then(function (data) {
                        store.init(data, true);
                    })
                }
            });
        });
    },

    deleteAddress: function () {
        $('#modal-delete-address .delete-address--action').on('click', function () {
            app.startLoading();
            var addressId = $(this).attr('data-id');
            apiHandler.deleteAddress(addressId).then(function () {
                location.reload();
            })
        })
    },
    compareAddresses: function (address1, address2) {
        if (address.__toString(address1) == address.__toString(address2)) {
            return true;
        }

        return false;
    },
    validateZip: function (zip) {
        var zipPattern = /^\d{5}(?:-\d{4})?$/;
        if (!zipPattern.test(zip)) {
            return 'Please enter valid ZIP.';
        }

        return false;
    },
    updateAddressConfirmed: function(addressId, postData){
        app.startLoading();
        apiHandler.patchUserAddress(addressId, postData).then(function (data) {
            app.displaySingleFormMessage($editAddressForm, 'Address successfully updated.');
            var geoData = {
                address: address.__toString(postData)
            };
            apiHandler.getGeocode(geoData).then(function (data) {
                store.init(data, true);
            });
        })
            .fail(function (data) {
                app.displayFormErrors($editAddressForm, data.responseJSON);
                app.stopLoading();
            })
        ;
    },
    updateHtmlCheckoutAddress: function(addressData) {
        var addressLine2 = '';
        var fulladdress = addressData.address_line1;
        if (addressData.address_line2) {
            addressLine2 = addressData.address_line2;
            fulladdress += '<br>' + addressLine2;
        }
        fulladdress += '<br>' + addressData.locality + ', ' + addressData.country_code + ', ' + addressData.postal_code;
        var addressImage = 'url(\'https://maps.googleapis.com/maps/api/staticmap?autoscale=2&size=650x400&maptype=roadmap&key=AIzaSyAKkJMIYxEv8IV9Eoshxc4U8uDYKKPO97A&format=png&visual_refresh=true&markers=icon:http://i.imgur.com/dZttCtd.png|' + addressData.address_line1 + '+' + addressLine2 + '+' + addressData.locality + '+' + addressData.country_code + '+' + addressData.postal_code + '\')';
        var geocodeData = {
            address: address.__toString(addressData)
        };
        var checkoutAddressSelector = $('.checkout-address-item');
        apiHandler.getGeocode(geocodeData).then(function(latLong){
            var long = latLong.longitude + 0.0018;
            var lat = latLong.latitude;
            var addressImageBlur = 'url(\'https://maps.googleapis.com/maps/api/staticmap?autoscale=2&size=650x400&maptype=roadmap&key=AIzaSyAKkJMIYxEv8IV9Eoshxc4U8uDYKKPO97A&format=png&visual_refresh=true&markers=icon:http://i.imgur.com/dZttCtd.png|' + addressData.address_line1 + '+' + addressLine2 + '+' + addressData.locality + '+' + addressData.country_code + '+' + addressData.postal_code + '&center=' + lat + ',' + long +'\')';
            checkoutAddressSelector.find('.map-blur').css('background-image', addressImageBlur);
        });
        checkoutAddressSelector.find('.map-source').css('background-image', addressImage);
        checkoutAddressSelector.find('address').html(fulladdress);
        checkoutAddressSelector.find('.checkout-address-item__actions').children('a').attr('data-id', addressData.id);
        checkoutAddressSelector.find('.special-instructions--action').html(address.getAdditionalInfo(addressData.id));
    }
};


$('body').on('click', '#addAddress', function () {
    if (user.getUserInfo() != null) {
        modal.openUpdateAddressModal()
    }
    else {
        addressComp.showCreateAddressForm();
    }
});

$('body').on('click', '.saved-address--action', function () {
    addressComp.updateToSavedAddress($(this).attr('data-id'));

});
$('#submit-new-setup-address').on('click', function () {
    addressComp.submitAddress();
});

$('#modal-update-address').keypress(function(e) {
    if (e.keyCode == $.ui.keyCode.ENTER) {
        e.preventDefault();
        $('#submit-new-setup-address').trigger('click');
    }
});

$('#initial-address-setup-notlogged').keypress(function(e) {
    if (e.keyCode == $.ui.keyCode.ENTER) {
        e.preventDefault();
        $('#submit-new-setup-address').trigger('click');
    }
});

//submit edit address form
var $editAddressForm = $('form#edit-address-form');
$editAddressForm.on('submit', function (e) {
    app.startLoading();
    e.preventDefault();
    var postData = $(this).serializeObject();
    var addressId = $(this).attr('data-id');

    var zipError = addressComp.validateZip(postData['postalCode']);
    if (zipError != false) {
        app.displaySingleFormError($editAddressForm, zipError);
        app.stopLoading();
    }
    else {
        postData = addressComp.prepareAddressFormat(postData, addressId);


        // if address is default check if changing store and delete cart
        if(address.getDefaultAddress().id == addressId) {
            storeComp.isDifferentStoreByString(address.__toString(postData)).then(function (isDifferentStore) {
                if (isDifferentStore) {
                    app.stopLoading();
                    modal.openDeleteCartConfirm().then(function () {
                        addressComp.updateAddressConfirmed(addressId, postData);
                    });
                }
                else {
                    addressComp.updateAddressConfirmed(addressId, postData);
                }
            });
        }
        else {
            addressComp.updateAddressConfirmed(addressId, postData);
        }
    }

});
var $editAddressCheckoutForm = $('form#edit-address-form-checkout');
$editAddressCheckoutForm.on('submit', function (e) {
    app.startLoading();
    e.preventDefault();
    var postData = $(this).serializeObject();
    var addressId = $(this).attr('data-id');
    var zipError = addressComp.validateZip(postData['postalCode']);
    if (zipError != false) {
        app.displaySingleFormError($editAddressCheckoutForm, zipError);
        app.stopLoading();
    } else {
        postData = addressComp.prepareAddressFormat(postData, addressId);
        var addressData = $(this).find('#addressLine1').val() + ' '
            + $(this).find('#administrativeArea').val() + ' ';
            + $(this).find('#locality').val();
        apiHandler.getGeocode({address: addressData}).then(function(addressData){
            apiHandler.getStores(addressData).then(function(sotreData){
                var availableStroeIds = [];
                if (sotreData.available.length === 0) {
                    app.stopLoading();
                    modal.openNoAvailableStoresModal();
                } else if (sotreData.available.length !== 0) {
                    sotreData.available.forEach(function(storeId, indx){
                        availableStroeIds.push(storeId.id);
                    });
                    if (availableStroeIds.indexOf(store.getStoreId()) === -1) {
                        $.localStorage.set('temporaryAddressPostData', postData);
                        $.localStorage.set('temporaryAddressId', addressId);
                        app.stopLoading();
                        modal.openAnotherAvailableStoresModal();
                    } else {
                        apiHandler.patchUserAddress(addressId, postData).then(function (data) {
                            app.displaySingleFormMessage($editAddressCheckoutForm, 'Address successfully updated.');
                            apiHandler.getUserDefaultAddress().then(function (addressData) {
                                address.setDefaultAddressToLocalStorage(addressData);
                                addressComp.updateHtmlCheckoutAddress(addressData);
                                app.stopLoading();
                                $.magnificPopup.close();
                            });
                        }).fail(function (data) {
                            app.displayFormErrors($editAddressCheckoutForm, data.responseJSON);
                            app.stopLoading();
                        });
                    }
                } else {
                    apiHandler.patchUserAddress(addressId, postData).then(function (data) {
                        app.displaySingleFormMessage($editAddressCheckoutForm, 'Address successfully updated.');
                        apiHandler.getUserDefaultAddress().then(function (addressData) {
                            address.setDefaultAddressToLocalStorage(addressData);
                            addressComp.updateHtmlCheckoutAddress(addressData);
                            app.stopLoading();
                            $.magnificPopup.close();
                        });
                    }).fail(function (data) {
                        app.displayFormErrors($editAddressCheckoutForm, data.responseJSON);
                        app.stopLoading();
                    });
                }
            })
        });
    }
});
$('#billing-shipping-address').on('click', function () {
    if ($('#billing-shipping-address:checked').length) {
        var addressData = address.getDefaultAddress();
        $('form#new-card-form').find('.address_line1').val(addressData.address_line1);
        $('form#new-card-form').find('.address_line2').val(addressData.address_line2);
        $('form#new-card-form').find('.address_city').val(addressData.locality);
        $('form#new-card-form').find('.address_state').val(addressData.administrative_area);
        $('form#new-card-form').find('.address_zip').val(addressData.postal_code);
    } else {
        $('form#new-card-form').find('.address_line1').val();
        $('form#new-card-form').find('.address_line2').val();
        $('form#new-card-form').find('.address_city').val();
        $('form#new-card-form').find('.address_state').val();
        $('form#new-card-form').find('.address_zip').val();
    }
});