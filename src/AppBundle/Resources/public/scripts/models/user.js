var user = {
    getDefaultAddress: function () {
        return address.getDefaultAddress();
    },

    getAddresses: function () {
        return address.getUserAddresses();
    },

    getUserInfo: function () {
        return $.localStorage.get('userInfo');
    },

    setUserInfo: function (userInfo) {
        $.localStorage.set('userInfo', userInfo);
    },

    update: function (userInfo) {
        if (!userInfo) {
            this.removeUserInfo();

            addressComp.showCreateAddressFormNotLoggedUser();

            return;
        }

        this.setUserInfo(userInfo);

        addressComp.showCreateAddressFormIfNotExist();
        //addressComp.updateUserAddresses();
    },

    removeUserInfo: function () {
        if ($.localStorage.isSet('userInfo')) {
            $.localStorage.remove('userInfo');
        }

        if ($.localStorage.isSet('userDetailedInfo')) {
            $.localStorage.remove('userDetailedInfo');
        }
    },

    setUserDetailedInfo: function (userDetailedInfo) {
        $.localStorage.set('userDetailedInfo', userDetailedInfo);

        //address.setDefaultAddress(userDetailedInfo.default_address);
        address.setUserAddresses(userDetailedInfo.addresses);
        creditCard.setCreditCards(userDetailedInfo.credit_cards);
        $.each(userDetailedInfo.credit_cards, function(index,card) {
            if(card.default == true)
            creditCard.setDefaultCreditCard(card);
            return;
        });
    },

    getUserDetailedInfo: function () {
        return $.localStorage.get('userDetailedInfo');
    }
};