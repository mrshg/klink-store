var storeComp = {

    init: function(startup){
        this.updateHeader();
        if(startup == true) {
            this.updateSampleStoreVarStartup();
        } else {
            this.updateSampleStoreVar();
        }
        this.storeClosedViewActions();
        this.showSampleStore();
    },

    getWeekDay: function (day) {
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        return weekday[day]
    },

    updateHeader: function () {
        var storeData;

        if(store.getStoreInfo()) {
            storeData = store.getStoreInfo();
        }
        else if(store.getUnavailableStoreInfo()) {
            storeData = store.getUnavailableStoreInfo();
        }

        if(storeData) {
            var storeHoursHtml = getStoreHoursHtml(storeData);
            $('#store-hours ul').html(storeHoursHtml);
        }
        else {
            $('#store-hours ul').html('<ul><li>Browsing sample Store</li></ul>');
        }
    },
    showStoreClosed: function (store, addressObj, closeModal) {
        populateStoreClosedModal(store, addressObj, closeModal);
        $('#modal-store-closed').addClass('active');

        modal.openStoreClosedModal();
    },
    showStoreOutOfArea: function(addressObj, closeModal) {
        populateStoreOutOfAreaModal(addressObj, closeModal);
        $('#modal-store-outofarea').addClass('active');

        modal.openStoreOutOfAreaModal();

    },
    showSampleStore: function () {
        $('.show-sample-store').on('click', function () {
            if ($(this).attr('data-close-modal') == 'true') {
                $.magnificPopup.instance.close();
            }
            else {
                var addressObj = JSON.parse($('.save-address').attr('data-address'));

                storeComp.isDifferentStoreByString(address.__toString(addressObj)).then(function (isDifferentStore) {
                    if (isDifferentStore) {
                        modal.openDeleteCartConfirm().then(function () {
                            storeComp.showSampleStoreConfirmed(addressObj)
                        });
                    }
                    else {
                        storeComp.showSampleStoreConfirmed(addressObj)
                    }
                });
            }
        });
    },
    showSampleStoreConfirmed: function(addressObj) {
        app.startLoading();
        address.setDefaultAddress(addressObj);

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
    updateSampleStoreVarStartup: function() {
        // if closed store not set on startup
        if($.cookieStorage.get('closedStore') != false && $.cookieStorage.get('closedStore') != true){
            $.cookieStorage.set('closedStore', false);
            $.localStorage.set('closedStore', false);
        }

        if(store.isStoreClosed() != true && store.isStoreAvailable() != true) {
            $.localStorage.set('sampleStore', true);
            $.cookieStorage.set('sampleStore', true);
            if (store.getStoreId() == null) {
                store.setStoreIds([1]);
                store.setStoreId(1);
            }
        }
        else {
            $.localStorage.set('sampleStore', false);
            $.cookieStorage.set('sampleStore', false);
        }

        if(store.isStoreClosed() == true) {
            if($.cookieStorage.get('closedStore') != true) {
                $.localStorage.set('closedStore', true);
                $.cookieStorage.set('closedStore', true);
                location.reload();
            }

            $.localStorage.set('closedStore', true);
            $.cookieStorage.set('closedStore', true);
        }
        else {
            if($.cookieStorage.get('closedStore') != false) {
                $.localStorage.set('closedStore', false);
                $.cookieStorage.set('closedStore', false);
                location.reload();
            }

            $.localStorage.set('closedStore', false);
            $.cookieStorage.set('closedStore', false);
        }
    },
    updateSampleStoreVar: function() {
        if(!store.isStoreClosed() && !store.isStoreAvailable()) {
            $.localStorage.set('sampleStore', true);
            $.cookieStorage.set('sampleStore', true);
            if (store.getStoreId() == null) {
                store.setStoreIds([1]);
                store.setStoreId(1);
            }
        }
        else {
            $.localStorage.set('sampleStore', false);
            $.cookieStorage.set('sampleStore', false);
        }

        if(store.isStoreClosed()) {
            $.localStorage.set('closedStore', true);
            $.cookieStorage.set('closedStore', true);
        }
        else {
            $.localStorage.set('closedStore', false);
            $.cookieStorage.set('closedStore', false);
        }
    },

    isDifferentStoreByString: function(newAddressString) {
        var deferred = jQuery.Deferred();
        var currentStore = store.getStoreId();

        var data = {
            'address': newAddressString
        };

        if(!user.getUserInfo()) {
            deferred.resolve(false);
        }
        else if(!cart.getTotal() > 0) {
            deferred.resolve(false);
        }

        apiHandler.getGeocode(data).then(function(data) {
            apiHandler.getStores(data).then(function(data) {
                if(data.available[0] && user.getUserInfo()) {
                    if (currentStore != data.available[0].id) {
                        deferred.resolve(true);
                    }
                }
                else {
                    deferred.resolve(true);
                }

                deferred.resolve(false);
            })
        });

        return deferred.promise();
    },

    isDifferentStoreById: function(newAddressId) {
        var addresses = user.getAddresses();
        var newAddress;

        $.each(addresses, function(index,address) {
            if(address.id == newAddressId) {
                newAddress = address;
            }
        });

        return storeComp.isDifferentStoreByString(address.__toString(newAddress));
    },

    deleteCartIfDifferentStore: function(newAddressId) {
        var currentStore = store.getStoreId();
        var addresses = user.getAddresses();
        var newAddress;

        if (addresses === null) {
            return;
        }

        $.each(addresses, function(index, address) {
           if(address.id == newAddressId) {
               newAddress = address;

               return;
           }
        });

        var data = {
            'address': address.__toString(newAddress)
        };
        apiHandler.getGeocode(data).then(function(data) {
            store.init(data);
            apiHandler.getStores(data).then(function(data) {
                storeComp.updateSampleStoreVar();
                if(data.available[0] && user.getUserInfo()) {
                    if (currentStore != data.available[0].id) {
                        apiHandler.deleteCart();
                    }
                }
                else {
                    apiHandler.deleteCart();
                }
            })
        })
    },
    storeClosedViewActions: function () {
        $('#modal-store-closed .view-map--action').on('click', function() {
            $(this).hide();
            $('#modal-store-closed .working-hours').hide();
            $('#modal-store-closed .map').show();
            $('#modal-store-closed .view-hours--action').show();
        });
        $('#modal-store-closed .view-hours--action').on('click', function() {
            $(this).hide();
            $('#modal-store-closed .map').hide();
            $('#modal-store-closed .working-hours').show();
            $('#modal-store-closed .view-map--action').show();
        });
    },

    showStoreClosedOnLoadIfNeeded: function (storeData) {
        if ($.localStorage.get('showStoreClosed') == true) {
            storeComp.showStoreClosed(
                storeData,
                address.getDefaultAddress(),
                true
            );

            $.localStorage.set('showStoreClosed', false);
        }
    },

    showStoreOutOfAreaOnLoadIfNeeded: function() {
        if ($.localStorage.get('showStoreOutOfArea') == true) {
            storeComp.showStoreOutOfArea(address.getDefaultAddress(), true);

            $.localStorage.set('showStoreOutOfArea', false);
        }
    }

};

function populateStoreClosedModal(store, addressObj, closeModal) {

    var hoursHtml = getStoreHoursHtml(store);

    $('#modal-store-closed .working-hours').html(hoursHtml);
    $('#modal-store-closed .map').html('<img src="https://maps.googleapis.com/maps/api/staticmap?autoscale=false&size=450x250&maptype=roadmap&key=AIzaSyAKkJMIYxEv8IV9Eoshxc4U8uDYKKPO97A&format=png&visual_refresh=true&markers=icon:http://i.imgur.com/dZttCtd.png|' + address.__toString(addressObj) + '">');

    $('body .save-address').attr('data-address', JSON.stringify(addressObj));

    //populate address
    $('#modal-store-closed .modal__header-info').html(address.__toHtml(addressObj));

    //populate if modal should be closed or address updated + reload
    $('#modal-store-closed .save-address').attr('data-close-modal',closeModal);
}
function populateStoreOutOfAreaModal(addressObj, closeModal) {
    closeModal = closeModal || false;

    $('.save-address').attr('data-address', JSON.stringify(addressObj));

    $('#modal-store-outofarea .map').html('<img src="https://maps.googleapis.com/maps/api/staticmap?autoscale=false&size=450x250&maptype=roadmap&key=AIzaSyAKkJMIYxEv8IV9Eoshxc4U8uDYKKPO97A&format=png&visual_refresh=true&markers=icon:http://i.imgur.com/dZttCtd.png|' + address.__toString(addressObj) + '">');

    //populate address
    $('#modal-store-outofarea .modal__header-info').html(address.__toHtml(addressObj));

    $('#modal-store-outofarea a.show-sample-store').attr('data-close-modal', closeModal);
    $('#modal-store-outofarea a.show-sample-store').attr('data-address', JSON.stringify(addressObj));
}

function getStoreHoursHtml(storeData) {

    var weekday = new Array(7);
    var hoursHtml = '';

    var storeHours = {};

    if(storeData != null) {
        storeHours = storeData['store_hours'];
    }

    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    $.each(storeHours, function(index,val) {
        //check if today
        if(new Date().getDay() == val['number']) {
            hoursHtml += '<li class="today"><strong>Today</strong>';
        }
        else {
            hoursHtml += '<li><strong>' + weekday[val['number']] + '</strong>';
        }

        $.each(val['hours'], function(indexHours, valHours) {
                // if(indexHours == 1) {
                    // hoursHtml += '<br>';
                // }
            var
                hoursFrom = valHours['from'].substring(0, 2),
                minutesFrom = valHours['from'].substring(3, 5),
                hoursTo = valHours['to'].substring(0, 2),
                minutesTo = valHours['to'].substring(3, 5)
                if (hoursFrom == hoursTo && minutesFrom == minutesTo) {
                    hoursHtml += '<span style="text-align: center">Closed</span>';
                } else {
                    hoursHtml += '<span>' + convertTimeTo12h(valHours['from']) + ' - ' + convertTimeTo12h(valHours['to']) + '</span>';
                }
            }
        );
    });

    return hoursHtml;
}

function convertTimeTo12h(time) {
    var hours = time.substring(0, 2);
    var minutes = time.substring(3, 5);

    if((hours === '00' && minutes === '00') || (hours === '11' && minutes === '59')) {
        return 'Midnight';
    }

    if(hours === '12' && minutes === '00') {
        return 'Noon';
    }

    if(hours > 12) {
        hours -= 12;
        minutes += ' p.m.';
    }
    else {
        if(hours.length == 1) {
            hours = '0' + hours;
        }
        minutes += ' a.m.';
    }

    return hours + ':' + minutes ;
}
