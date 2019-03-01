var profileComp = {
    init: function () {
        this.updateUserInfo();
        this.updateUserCheckoutInfo();
        this.updateUserPassword();
        this.forgotPassword();
    },

    populateEditUserCheckoutModal: function () {
        var editProfileForm = $('#edit-profile-checkout');
        editProfileForm.find('.messages').remove();

        var userInfo = user.getUserDetailedInfo();

        $(editProfileForm).find('#fullname').val(userInfo.full_name);

        var phoneNumber = '';
        if (userInfo.phone_number) {
            phoneNumber = userInfo.phone_number;
            $(editProfileForm).find('#phone').removeClass('error');
        }
        else {
            $(editProfileForm).find('#phone').addClass('error');
        }

        if (editProfileForm.find('#user-recipients-age:checked').length) {
            $(editProfileForm).find('.error-msg-age').hide();
        } else {
            $(editProfileForm).find('.error-msg-age').show();
        }

        $(editProfileForm).find('#phone').val(phoneNumber);
    },

    updateUserCheckoutInfo: function () {
        var profileComp = this;
        var editProfileForm = $('#edit-profile-checkout');

        editProfileForm.submit(function (e) {
            if (!editProfileForm.find('#user-recipients-age:checked').length) {

                $(editProfileForm).find('.error-msg-age').show();
                e.preventDefault();
                return;
            }
            app.startLoading();
            e.preventDefault();
            var userInfo = user.getUserDetailedInfo();
            var $postData = 'phoneNumber=' + encodeURIComponent(editProfileForm.find('#phone').val());
            apiHandler.getUserData().then(function(userData){
                if (userData.full_name === editProfileForm.find('#fullname').val() && userData.phone_number != editProfileForm.find('#phone').val()) {
                    apiHandler.patchUserData($postData).then(function () {
                        var userFormData = editProfileForm.serializeObject();
                        userInfo.full_name = userFormData.fullName;
                        userInfo.phone_number = userFormData.phoneNumber;
                        user.setUserDetailedInfo(userInfo);
                        profileComp.updateAccountInfoHtml(userInfo);
                        app.stopLoading();
                    }).fail(function (data) {
                        app.displayFormErrors(editProfileForm, data.responseJSON);

                        app.stopLoading();
                    });
                } else {
                    var fullName = editProfileForm.find('#fullname').val();
                    var phone = editProfileForm.find('#phone').val();
                    userInfo.full_name = fullName;
                    userInfo.phone_number = phone;
                    user.setUserDetailedInfo(userInfo);
                    profileComp.updateAccountInfoHtml(userInfo);
                }
                app.stopLoading();
                $.magnificPopup.close();
            });
        });
    },

    populateEditUserModal: function () {
        var editProfileForm = $('#edit-profile');
        editProfileForm.find('.messages').remove();

        var userInfo = user.getUserDetailedInfo();

        $(editProfileForm).find('#fullname').val(userInfo.full_name);
        $(editProfileForm).find('#email').val(userInfo.email);

        var phoneNumber = '';
        if (userInfo.phone_number) {
            phoneNumber = userInfo.phone_number;
            $(editProfileForm).find('#phone').removeClass('error');
        }
        else {
            $(editProfileForm).find('#phone').addClass('error');
        }

        $(editProfileForm).find('#phone').val(phoneNumber);

        var birthday = '';
        if (userInfo.birthday) {
            birthday = userInfo.birthday;
        }
        $(editProfileForm).find('#birthday').val(this.formatDateForDisplay(birthday));
        // $(editProfileForm).find('#birthday').datepicker(datepickerOptions);
    },

    updateUserInfo: function () {
        var profileComp = this;
        var editProfileForm = $('#edit-profile');

        editProfileForm.submit(function (e) {
            e.preventDefault();

            var postData = $(this).serializeObject();

            var errors = profileComp.validateUserFields(postData);
            if (errors != '') {
                app.displaySingleFormError(editProfileForm, errors);

                return false;
            }

            app.startLoading();

            apiHandler.patchUserData(editProfileForm.serialize()).then(function () {
                apiHandler.getUserProfile().then(function(data) {
                    user.setUserDetailedInfo(data);
                    profileComp.updateAccountInfoHtml(data);

                    app.stopLoading();
                    $.magnificPopup.close();
                });
            }).fail(function (data) {
                app.displayFormErrors(editProfileForm, data.responseJSON);

                app.stopLoading();
            });

        });
    },

    updateUserPassword: function () {
        var updatePasswordForm = $('#update-password');

        updatePasswordForm.submit(function (e) {
            e.preventDefault();
            app.startLoading();

            var postObject = updatePasswordForm.serializeObject();
            var errors = profileComp.validatePassword(postObject['newPassword'], postObject['newPasswordConfirm']);

            if(errors != '') {
                app.displaySingleFormError(updatePasswordForm, errors);
                app.stopLoading();

                return false;
            }

            updatePasswordForm.find('.messages').remove();

            apiHandler.patchUserPassword(updatePasswordForm.serialize()).then(function () {
                app.displaySingleFormMessage(updatePasswordForm, 'Password successfully changed.');

                updatePasswordForm.trigger('reset');

                app.stopLoading();
            }).fail(function (data) {
                app.displaySingleFormError(updatePasswordForm, 'Current password incorrect.');

                app.stopLoading();
            });
        });
    },

    validatePassword: function(password1, password2) {
        var errors = '';
        if(password1 != password2) {
            errors += 'Passwords do not match.<br>';
        }
        if(password1.length < 6) {
            errors += 'Password must have least 6 characters.<br>';
        }

        return errors;
    },

    updateAccountInfoHtml: function (userInfo) {
        var html = ' <p class="account-info__name">' + userInfo.full_name + '</p>' +
            // '<p>' + userInfo.email + '</p>' +
            '<p>' + userInfo.phone_number + '</p>';
            // '<p>' + this.formatDateForDisplay(userInfo.birthday) + '</p>';
        if ($('#edit-profile-checkout').find('#user-recipients-age:checked').length) {
            html += '<div class="valid-recipient-age">21 or older with valid ID</div>';
        }

        var accountInfo = $('.account-info');

        if (accountInfo.length) {
            accountInfo.find('p').remove();
            accountInfo.prepend(html);

            return
        }

        if ($('.user-info__content').length) {
            var phoneNumber = '<span class="error">' + 'Please add phone number' + '</span>';

            if (userInfo.phone_number) {
                phoneNumber = userInfo.phone_number;
            }

            var html = ' <p class="account-info__name">' + userInfo.full_name + '</p>' +
                // '<p>' + userInfo.email + '</p>' +
                '<p>' + phoneNumber + '</p>' +
                // '<p>' + this.formatDateForDisplay(userInfo.birthday) + '</p>';

            $('.user-info__content').find('.center').html(html);

            checkoutComp.validateCheckoutData();
        }
    },

    forgotPassword: function() {
        var $forgotPasswordForm = $('#forgot-password');
        $forgotPasswordForm.on('submit', function(e) {
            e.preventDefault();
            app.startLoading();

            apiHandler.postResetPassword($forgotPasswordForm.serialize()).then(function () {
                $('.modal--password .modal__body').html('<p>Please check your email, we sent you link for resetting password.</p>');
                $('.modal--password .modal__actions').html('<a href="?modal=login" class="btn btn--primary" data-effect="mfp-3d-unfold">Back to log in</a>');
                app.stopLoading();
            })
            .fail(function(){
                app.displaySingleFormError($forgotPasswordForm, 'Email you entered not found.');
                app.stopLoading();
            });
        })
    },

    //resetPassword: function () {
    //    var $resetPasswordForm = $('form#reset-password');
    //    $resetPasswordForm.on('submit', function (e) {
    //        e.preventDefault();
    //        app.startLoading();
    //
    //        var postObject = $resetPasswordForm.serializeObject();
    //
    //        // validate password
    //        var errors = profileComp.validatePassword(postObject['password'], postObject['passwordConfirmation']);
    //        if(errors != '') {
    //            app.displaySingleFormError($resetPasswordForm, errors);
    //            app.stopLoading();
    //            return false;
    //        }
    //
    //        apiHandler.putResetPassword($resetPasswordForm.serialize()).then(function() {
    //            $resetPasswordForm.replace('Password successfully changed. <a href="#modal-login" class="activate-modal-link" data-effect="mfp-3d-unfold">Back to Log In</a>');
    //            app.stopLoading();
    //        }).fail(function(data) {
    //            app.displayFormErrors($resetPasswordForm, data.responseJSON);
    //            app.stopLoading();
    //        })
    //
    //    })
    //},

    formatDateForDisplay: function(date) {
        var d = this.parseDateString(date);

        var month = d.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }

        var day = d.getDate();
        if (day < 10) {
            day = '0' + day;
        }

        return month + '/' + day + '/' + d.getFullYear();
    },

    validateUserFields: function(data) {
        var errors = '';

        // Validate Full Name
        if (!/\w+\s+\w+/.test(data.fullName)) {
            errors += 'Please enter your first and last name.<br />';
        }
        if (data.fullName.match(/\d+/g) || data.fullName.match(/[^\w\s,.'-]/gi)) {
           errors += 'Your name contains illegal characters.<br />';
        }


        // Validate Phone Number
        if (data.phoneNumber) {
           if (data.phoneNumber.match(/[^\d\s+-.()]/g)) {
               errors += 'Your phone number contains illegal characters.<br />'
           }
            var mobilePhoneInputErrors = profileComp.checkPhoneNumberInput(data.phoneNumber);
            for (var i = 0; i < mobilePhoneInputErrors.length; i++) {
                errors += mobilePhoneInputErrors[i];
            }
        }


        // Validate Email Address
        var emailPattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        if (!emailPattern.test(data.email)) {
            errors += 'Please provide a valid email address.<br />';
        }


        // Validate Birthday
        var birthdayInputErrors = profileComp.checkBirthdayInput(data.birthday);
        for (var i = 0; i < birthdayInputErrors.length; i++) {
            errors += birthdayInputErrors[i];
        }

        var birthdayErrors = profileComp.checkValidBirthday(data.birthday);
        for (var i = 0; i < birthdayErrors.length; i++) {
            errors += birthdayErrors[i];
        }

        var adultErrors = profileComp.checkIfAdult(data.birthday);
        for (var i = 0; i < adultErrors.length; i++) {
            errors += adultErrors[i];
        }

        return errors;
    },

    checkBirthdayInput: function(plainBirthday) {
        var errors = [];
        var birthdayPattern = /^\d{2}\/\d{2}\/\d{4}$/g;

        if (!birthdayPattern.test(plainBirthday)) {
            errors.push("Please provide your birthday the following format: mm/dd/yyyy<br />");
        }

        return errors;
    },

    checkValidBirthday: function(birthday) {
        var errors = [];

        birthday = this.parseDateString(birthday);
        if (Object.prototype.toString.call(birthday) !== "[object Date]" || isNaN(birthday.getTime())) {
            errors.push("Your birthday does not seem valid.<br />");
        }

        return errors;
    },

    checkIfAdult: function(birthday) {
        var errors = [];
        birthday = this.parseDateString(birthday);

        var birthYear = birthday.getFullYear();
        var birthMonth = birthday.getMonth() + 1;
        var birthDay = birthday.getDate();
        var todayDate = new Date();
        var todayYear = todayDate.getFullYear();
        var todayMonth = todayDate.getMonth() + 1;
        var todayDay = todayDate.getDate();
        var age = todayYear - birthYear;

        if (todayMonth < birthMonth) {
            age--;
        }

        if (birthMonth == todayMonth && todayDay < birthDay) {
            age--;
        }

        if (age < 21) {
            errors.push('You must be 21 to Klink!<br />');
        }

        return errors;
    },

    checkPhoneNumberInput: function(mobilePhone) {
        var errors = [];
        var mobilePhonePattern = /^\(\d{3}\) \d{3}-\d{4}$/g;
        if (!mobilePhonePattern.test(mobilePhone)) {
            errors.push("Please provide your phone number in the following format: (xxx) xxx-xxxx<br />");
        }

        return errors;
    },

    parseDateString: function(dateString) {
        var t, date = null;

        if (typeof dateString === 'string') {
            t = dateString.split(/[- :/T]/);

            if (t[0].length === 4) {
                // YYYY-MM-DD HH:MM:SS
                date = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
            } else if (t[0].length === 2) {
                // MM/DD/YYYY
                date = new Date(t[2], t[0] - 1, t[1], t[3] || 0, t[4] || 0, t[5] || 0);
            }
        }

        return date;
    }
};

profileComp.init();