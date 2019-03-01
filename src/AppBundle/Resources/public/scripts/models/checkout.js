var checkout = {
    initOrder: function (userProfile) {
        var checkout = {
            'shippingAddress': address.getDefaultAddress(),
            'billingAddress': address.getDefaultAddress(),
        };

        checkout.shippingAddress.full_name = userProfile.full_name;
        checkout.billingAddress.full_name = userProfile.full_name;
        checkout.phone_number = userProfile.phone_number;
        checkout.additional_information = address.getAdditionalInfo(checkout.shippingAddress.id);

        $.localStorage.set('checkout', checkout);
    },
    getOrder: function () {
        return $.localStorage.get('checkout');
    },
    setShippingAddress: function () {

    },
    setPhoneNumber: function () {

    },
    setAdditionalInformation: function () {

    },
    removeCheckout: function () {
        $.localStorage.remove('checkout');
    }
};