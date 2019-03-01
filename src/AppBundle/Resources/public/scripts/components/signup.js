var SignUp = {
    init: function () {
        this.setupFormSubmitEvent();
    },
    setupFormSubmitEvent: function () {
        var $signupForm = $('#form-signup');
        $signupForm.on('submit', function (e) {
            app.startLoading();
            e.preventDefault();
            var postData = $(this).serializeObject();

            var errors = profileComp.validateUserFields(postData);
            errors += profileComp.validatePassword(postData['plainPassword'][0], postData['plainPassword'][1]);
            if(errors != '') {
                app.displaySingleFormError($signupForm, errors);
                app.stopLoading();

                return false;
            }

            $.post(api.assetUrl+"register", postData)
                .done(function () {
                    var loginData = {
                        _username: postData['email'],
                        _password: postData['plainPassword'][0]
                    };

                    if (typeof(window.analytics) == 'function') {
                        window.analytics.track("Created Account", {
                                userEmail: postData['email']
                        });
                    }

                    if (typeof(fbq) == "function") {
                        fbq('track', 'CompleteRegistration');
                    }

                    securityHandler.loginAfterRegister(loginData);
                })
                .fail(function (data) {
                    app.displayFormErrors($signupForm, data.responseJSON);
                    app.stopLoading();
                });

        });
    }
};
