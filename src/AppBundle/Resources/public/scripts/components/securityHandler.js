var securityHandler = {
    init: function () {
        this.loginClick();
    },

    loginClick: function () {
        $('form.login').on('submit', function (e) {
            e.preventDefault();
            app.startLoading();
            securityHandler.loginAction($(this).serialize(), $(this));
        })
    },

    loginAction: function (loginData, $loginForm) {
        $.ajax({
            type: 'POST',
            url: api.assetUrl + 'login-check',
            data: loginData,
            success: function (data) {
                //check if login was success
                try {
                    JSON.parse(data);
                } catch (e) {
                    app.displaySingleFormError($loginForm, 'Your username or password is incorrect.');
                    app.stopLoading();

                    return false;
                }

                var addressBeforeLogin = address.getDefaultAddress();
                user.update(data);

                // if address was set before login, set it to user default address
                if (addressBeforeLogin) {
                    addressBeforeLogin = addressComp.prepareAddressFormat(addressBeforeLogin);
                    apiHandler.getUserAddresses().then(function (data) {
                        securityHandler.checkIfAlreadyHasAddressAndSetDefault(data, addressBeforeLogin).then(function (data) {
                            if (data == false) {
                                address.setDefaultAddress(addressBeforeLogin, false);
                            }

                            securityHandler.updateStoreAfterLogin(addressBeforeLogin);
                        }).fail(function () {
                            $.localStorage.set('showStoreClosed', true);
                            $.localStorage.set('showStoreOutOfArea', true);
                            location.reload();
                        });
                    }).fail(function () {
                        address.setDefaultAddress(addressBeforeLogin, false);
                        securityHandler.updateStoreAfterLogin(addressBeforeLogin);
                    })
                }
                else {
                    securityHandler.initAddressAfterLoginFromSampleStore();
                }
            }
        })
    },

    loginAfterRegister: function (loginData) {
        $.ajax({
            type: 'POST',
            url: api.assetUrl + 'login-check',
            data: loginData,
            success: function (data) {
                user.setUserInfo(data);

                var addressBeforeLogin = address.getDefaultAddress();

                // if address was set before register, post it and set it to user default address
                if (addressBeforeLogin) {
                    addressBeforeLogin = addressComp.prepareAddressFormat(addressBeforeLogin);

                    var addressData = {
                        address: address.__toString(addressBeforeLogin)
                    };

                    apiHandler.postUserAddresses(addressBeforeLogin,false).then(function (data) {
                        apiHandler.patchUserDefaultAddress(data.id).then(function () {
                            apiHandler.getGeocode(addressData).then(function (data) {
                                var latLong = {
                                    'latitude': data.latitude,
                                    'longitude': data.longitude
                                };

                                address.setLatitudeAndLongitude(latLong['latitude'], latLong['longitude']);

                                securityHandler.updateStoreAfterLogin(addressBeforeLogin);
                            });
                        });
                    });
                }
                else {
                    securityHandler.initAddressAfterLoginFromSampleStore();
                }
            }
        })
    },

    checkIfAlreadyHasAddressAndSetDefault: function (addresses, addressBeforeLogin) {
        var deferred = jQuery.Deferred();

        var hasAddress = false;

        if (addresses.length) {
            $.each(addresses, function (index, addressData) {
                if (addressComp.compareAddresses(addressData, addressBeforeLogin) == true) {

                    address.setDefaultAddress(addressComp.prepareAddressFormat(addressData), false);
                    hasAddress = true;

                    //check if changing store and delete cart
                    storeComp.isDifferentStoreByString(address.__toString(addressBeforeLogin)).then(function(){
                        deferred.resolve(true);

                        return false;
                    });

                    return false;
                }
            });
        }

        if (hasAddress == false) {
            deferred.resolve(false);
        }

        return deferred.promise();
    },

    initAddressAfterLoginFromSampleStore: function () {
        apiHandler.getUserDefaultAddress().then(function (data) {
            address.setDefaultAddressToLocalStorage(data);

            securityHandler.updateStoreAfterLogin(data);
        }).fail(function () {
            location.reload();
        });

        $.localStorage.set('addressPopupShow', null);
    },

    addToCartAfterLoginActions: function () {
        if (cart.getItemInCartNotLogged()) {
            cartComp.addToCartAfterLogin();
        }
        else if (cart.getPackInCartNotLogged()) {
            packComp.addPackToCartAfterLogin().then(function () {
                location.reload();
            }).fail(function () {
                location.reload();
            });
        }
        else {
            location.reload();
        }
    },

    updateStoreAfterLogin: function (addressObj) {
        var addressData = {
            address: address.__toString(addressObj)
        };
        //update store
        apiHandler.getGeocode(addressData).then(function (data) {
            var latLong = {
                'latitude': data.latitude,
                'longitude': data.longitude
            };

            address.setLatitudeAndLongitude(latLong['latitude'], latLong['longitude']);
            //update store
            $.when(apiHandler.getStores(latLong)).then(function (data) {
                store.setStoresData(data);
                storeComp.updateSampleStoreVar();

                var prevStoreId = cart.getChannels();
                var newStoreId = store.getStoreId();
                if(prevStoreId != newStoreId) {
                    apiHandler.deleteCart().then(function () {
                        securityHandler.addToCartAfterLoginActions();
                    });
            }
                else {
                    securityHandler.addToCartAfterLoginActions();
                }
        });
    });
    }

};