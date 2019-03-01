var store = {
    init: function(latLong, reload) {
        $.when(apiHandler.getStores(latLong)).then(function(data) {
            store.setStoresData(data);
            storeComp.updateSampleStoreVar();
            storeComp.updateHeader();
            addressComp.updateHeader();

            if(reload == true) {
                window.location.replace(location.pathname);
            }
            else if(reload == 'discover') {
                window.location.replace(location.protocol + "//" + location.host + '/discover/');
            }
        });
        storeComp.updateSampleStoreVar();
    },
    setStoreIds: function (storeIds) {
        $.localStorage.set('storeIds', storeIds);
        $.cookieStorage.set('storeIds', storeIds);
    },
    setStoreId: function (storeId) {
        $.localStorage.set('storeId', storeId);
        $.cookieStorage.set('storeId', storeId);
    },
    setStoresData: function (storesData) {
        $.localStorage.set('storesData', storesData);
        $.cookieStorage.set('storesData', storesData);
        $.cookieStorage.set('storeInfo', storesData.available[0]);

        if (storesData.available.length > 0) {
            $.localStorage.set('sampleStore', false);
            $.cookieStorage.set('sampleStore', false);
            this.setStoreId(storesData.available[0].id);
            this.setStoreIds([storesData.available[0].id]);
        }
        else if(storesData.unavailable.length > 0) {
            $.localStorage.set('sampleStore', false);
            $.cookieStorage.set('sampleStore', false);
            this.setStoreId(storesData.unavailable[0].id);
            this.setStoreIds([storesData.unavailable[0].id]);

            storeComp.showStoreClosedOnLoadIfNeeded(storesData.unavailable[0]);
        }
        else {
            $.localStorage.set('sampleStore', true);
            $.cookieStorage.set('sampleStore', true);
            this.setStoreIds([1]);
            this.setStoreId(1);

            storeComp.showStoreOutOfAreaOnLoadIfNeeded();
        }
    },
    getStoreInfo: function () {
        var store = $.localStorage.get('storesData');

        if(store) {
            return store.available[0];
        }
        else {
            return null;
        }
    },
    getUnavailableStoreInfo: function() {
        var store = $.localStorage.get('storesData');

        if(store) {
            return store.unavailable[0];
        }
        else {
            return null;
        }
    },
    getStoreIds: function () {
        return $.localStorage.get('storeIds');
    },
    getStoreId: function () {
        return $.localStorage.get('storeId');
    },
    getProducts: function () {
        return product.getProductsByStoreIDs($.localStorage.get('storeIds'));
    },
    isSampleStore: function() {
        return $.localStorage.get('sampleStore');
    },
    isStoreAvailable: function() {
        var stores = $.localStorage.get('storesData');

        if (stores == null) {

            return false;
        }

        else if (stores.available.length) {

            return true;
        }

        return false;
    },
    isStoreClosed: function () {
        var stores = $.localStorage.get('storesData');

        if (stores == null) {

            return false;
        }

        else if (stores.unavailable.length && !stores.available.length) {

            return true;
        }

        return false;
    }
};