var address = {
    init: function (defaultAddress) {
        if (user.getUserInfo()) {
            $.when(apiHandler.getUserDefaultAddress()).then(function (data) {
                    $.localStorage.set('defaultAddress', data);
                    $.cookieStorage.set('defaultAddress', data);

                    addressComp.updateHeader();
                    var addressData = {
                        address: address.__toString(data)
                    };

                    apiHandler.getGeocode(addressData).then(function (data) {
                        var latLong = {
                            'latitude': data.latitude,
                            'longitude': data.longitude
                        };

                        address.setLatitudeAndLongitude(latLong['latitude'], latLong['longitude']);
                        store.init(latLong);
                    });
                })
                .fail(function () {
                    storeComp.updateSampleStoreVar();
                    addressComp.updateHeader();
                })
            ;

            this.updateUserAddresses();
        }
    },
    initNotLoggedIn: function () {
        var defaultAddress = address.getDefaultAddress();

        if (defaultAddress) {
            var data = {
                'address': address.__toString(defaultAddress)
            };

            $.when(apiHandler.getGeocode(data).then(function (data) {
                address.setLatitudeAndLongitude(data);
                store.init(data);
            }));
        }
        else {
            storeComp.updateHeader();
            addressComp.updateHeader();
        }
    },
    setDefaultAddress: function (data, checkLocalStorage) {
        var addressObj = addressComp.prepareAddressFormat(data);
        if (user.getUserInfo()) {
            if (!data.id) {
                apiHandler.postUserAddresses(addressObj, checkLocalStorage).then(function (data) {
                    var addressData = {
                        'id': data['id']
                    };

                    apiHandler.patchUserDefaultAddress(addressData).then(function () {
                        $.localStorage.set('defaultAddress', data);
                        $.cookieStorage.set('defaultAddress', data);
                        storeComp.deleteCartIfDifferentStore(data.id);
                    });
                });
            }
            else {
                apiHandler.patchUserDefaultAddress(addressObj).then(function () {
                    storeComp.deleteCartIfDifferentStore(data.id);
                });
            }
        }
        else {
            var addressData = {
                'address': address.__toString(addressObj)
            };
            $.localStorage.set('defaultAddress', addressObj);
            $.cookieStorage.set('defaultAddress', addressObj);
            apiHandler.getGeocode(addressData).then(function (data) {
                store.init(data);
            });
        }
    },
    setDefaultAddressToLocalStorage: function (data) {
        $.localStorage.set('defaultAddress', data);
        $.cookieStorage.set('defaultAddress', data);
    },
    setLatitudeAndLongitude: function (latitude, longitude) {
        $.localStorage.set('latitude', latitude);
        $.cookieStorage.set('latitude', latitude);

        $.localStorage.set('longitude', longitude);
        $.cookieStorage.set('longitude', longitude);
    },
    getDefaultAddress: function () {
        return $.localStorage.get('defaultAddress');
    },
    setUserAddresses: function (address) {
        $.localStorage.set('addresses', address);
    },
    getUserAddresses: function () {
        return $.localStorage.get('addresses');
    },
    updateUserAddresses: function () {
        apiHandler.getUserAddresses().then(function (data) {
            address.setUserAddresses(data);
        })
    },
    getLatitudeAndLongitude: function () {
        return {
            'latitude': $.localStorage.get('latitude'),
            'longitude': $.localStorage.get('longitude')
        };
    },
    setAdditionalInfo: function (additionalInfo, addressId) {
        $.localStorage.set('additionalInformation-' + addressId, additionalInfo);
    },
    getAdditionalInfo: function (addressId) {
        return $.localStorage.get('additionalInformation-' + addressId);
    },
    __toHtml: function (addressObj) {
        addressObj = addressObj || this.getDefaultAddress();

        var addressString = '';

        if (addressObj['address_line1']) {
            addressString = addressObj['address_line1'] + '<br>';
            if (addressObj['address_line2']) {
                addressString += addressObj['address_line2'] + '<br>';
            }
            if (addressObj['administrative_area'].length === 5) {
                addressObj['administrative_area'] = addressObj['administrative_area'].slice(-2);
            }
            addressString += addressObj['locality'] + ', ' + addressObj['administrative_area'] + ' ' + addressObj['postal_code'];
        }
        else if (addressObj['addressLine1']) {
            addressString = addressObj['addressLine1'] + '<br>';
            if (addressObj['addressLine2']) {
                addressString += addressObj['addressLine2'] + '<br>';
            }
            if (addressObj['administrativeArea'].length === 5) {
                addressObj['administrativeArea'] = addressObj['administrativeArea'].slice(-2);
            }
            addressString += addressObj['locality'] + ', ' + addressObj['administrativeArea'] + ' ' + addressObj['postalCode'];
        }

        return addressString;
    },
    __toString: function (addressObj) {
        addressObj = addressObj || this.getDefaultAddress();

        var addressString = '';

        if (addressObj['address_line1']) {
            addressString = addressObj['address_line1'] + '+';
            if (addressObj['address_line2']) {
                addressString += addressObj['address_line2'] + '+';
            }
            addressString += addressObj['locality'] + '+' + addressObj['administrative_area'] + '+' + addressObj['postal_code'];

        }
        else if (addressObj['addressLine1']) {
            addressString = addressObj['addressLine1'] + '+';
            if (addressObj['addressLine2']) {
                addressString += addressObj['addressLine2'] + '+';
            }
            addressString += addressObj['locality'] + '+' + addressObj['administrativeArea'] + '+' + addressObj['postalCode'];

        }

        return addressString;
    }
};