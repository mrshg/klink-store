var creditCard = {
    setDefaultCreditCard: function (creditCard) {
        $.localStorage.set('defaultCreditCard', creditCard);
    },
    setCreditCards: function (creditCards) {
        $.localStorage.set('creditCards', creditCards);

        var creditCard = this;

        creditCards.forEach(function (key, value) {
            if (value.default) {
                creditCard.setDefaultCreditCard(value);
            }
        });
    },
    getDefaultCreditCard: function () {
        return $.localStorage.get('defaultCreditCard');
    },
    getCreditCards: function () {
        return $.localStorage.get('creditCards');
    }
};