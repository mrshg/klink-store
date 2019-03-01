var cart = {
    init: function () {
        $.when(apiHandler.getCart()).then(function (data) {
            $.localStorage.set('cart', data);
            $.cookieStorage.set('cart', data);
            cartComp.init();
        });

        if(!this.getCartDisplay()) {
            this.setCartDisplay(false);
        }
    },

    setCart: function (cart) {
        $.localStorage.set('cart', cart);
        $.cookieStorage.set('cart', cart);
    },
    setTip: function (tipAmount) {
        var cart = this.getCart();

        cart.total = cart.total - cart.tip_total + tipAmount;
        cart.tip_total = tipAmount;

        this.setCart(cart);
    },
    getCart: function () {
        return $.localStorage.get('cart');
    },
    setCartDisplay: function(display) {
        $.localStorage.set('cartOpen', display);
        $.cookieStorage.set('cartOpen', display);
        var width = $(window).width();
        if (display == true && this.getItems().length == 1 && width < 720) {
            $('body').addClass('cart-active');
        }
    },
    getCartDisplay: function() {
        return $.localStorage.get('cartOpen');
    },
    getItems: function () {
        if (this.getCart()) {
            return this.getCart().items;
        }

        return [];
    },
    getTotal: function () {
        if (this.getCart()) {
            return this.getCart().total;
        }

        return 0;
    },
    getItemsTotal: function () {
        if (this.getCart()) {
            return this.getCart().items_total;
        }

        return 0;
    },
    getShippingTotal: function () {
        if (this.getCart()) {
            return this.getCart().shipping_total;
        }

        return 0;
    },
    getTaxTotal: function () {
        if (this.getCart()) {
            return this.getCart().tax_total;
        }

        return 0;
    },
    getTipTotal: function () {
        if (this.getCart()) {
            return this.getCart().tip_total;
        }

        return 0;
    },
    getCheckoutMessage: function() {
        if (this.getCart()) {
            return this.getCart().checkout_message;
        }

    },
    getCountItemsQty: function () {
        var count = 0;
        if (this.getCart()) {
            var items = this.getCart().items;

            $.each(items, function (key, item) {
                count += item.quantity;
            });
        }

        return count;
    },
    getPromotionTotal: function (){
        if (this.getCart()) {
            return this.getCart().promotion_total;
        }
    },
    getCoupon: function (){
        if (this.getCart()) {
            return this.getCart().coupon;
        }
    },
    getChannels: function(){
        if (this.getCart()) {
            return this.getCart().channels[0];
        }
    },
    canCheckout: function () {
        if (this.getCart()) {
            return this.getCart().can_checkout;
        }

        return false;
    },
    removeCart: function () {
        $.localStorage.remove('cart');
    },
    setPackInCartNotLogged: function(data) {
        $.localStorage.set('packInCartNotLogged', data);
    },
    removePackInCartNotLogged: function() {
        $.localStorage.remove('packInCartNotLogged');
    },
    getPackInCartNotLogged: function() {
        return $.localStorage.get('packInCartNotLogged');
    },
    setItemInCartNotLogged: function(variantId) {
        $.localStorage.set('itemInCartNotLogged', variantId);
    },
    removeItemInCartNotLogged: function() {
        $.localStorage.remove('itemInCartNotLogged');
    },
    getItemInCartNotLogged: function() {
        return $.localStorage.get('itemInCartNotLogged');
    }
};



