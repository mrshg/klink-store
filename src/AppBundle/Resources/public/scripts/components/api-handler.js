var apiHandler = {

    // CATEGORIES
    getCategories: function () {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/categories/",
            data: {
                "stores": [store.getStoreId()]
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });

        return deferred.promise();
    },


    // ADDRESSES
    getUserAddresses: function () {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/user/addresses/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.getUserAddresses();
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    getUserAddress: function (addressId) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/user/addresses/" + addressId + "/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.getUserAddress(addressId);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    patchUserAddress: function (addressId, data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'PATCH',
            url: api.endpoint + "/user/addresses/" + addressId + "/",
            data: data,
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.patchUserAddress(addressId, data);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    postUserAddresses: function (data, checkLocalStorage) {
        var addresses = address.getUserAddresses();
        var deferred = jQuery.Deferred();
        var post = true;
        if (checkLocalStorage != false) {
            checkLocalStorage = true;
        }
        if (checkLocalStorage == true) {
            for (var i = 0; i < addresses.length; i++) {
                if(addressComp.compareAddresses(addresses[i], data) == true) {
                    post = false;
                    deferred.resolve(addresses[i]);
                    return deferred.promise();
                }
            }
        }

        if(post == true) {
            $.ajax({
                method: 'POST',
                url: api.endpoint + "/user/addresses/",
                data: data,
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                if (error.status == 403) {
                    apiHandler.refreshAuth().then(function () {
                        apiHandler.postUserAddresses(data);
                    })
                }
                else {
                    deferred.reject(error);
                }
            });
        }

        return deferred.promise();
    },

    patchUserDefaultAddress: function (data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'PATCH',
            url: api.endpoint + "/user/addresses/default/",
            data: data,
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.patchUserDefaultAddress(data);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    getUserDefaultAddress: function () {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/user/addresses/default/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.getUserDefaultAddress();
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    getUserProfile: function () {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/user/profile/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.getUserProfile();
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    getGeocodeReverse: function (data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/geocode-reverse/",
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });

        return deferred.promise();
    },

    getGeocode: function (data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/geocode/",
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });

        return deferred.promise();
    },

    getAddressSuggestions: function (data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/address-suggestions/",
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });

        return deferred.promise();
    },

    deleteAddress: function (addressId) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'DELETE',
            url: api.endpoint + "/user/addresses/" + addressId + "/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.deleteAddress(addressId);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },


    // PRODUCTS
    getProducts: function (data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/products/",
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });

        return deferred.promise();
    },


    // CARTS
    getCart: function () {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/cart/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.getCart();
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    putCartTip: function (amount) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'PUT',
            url: api.endpoint + "/cart/tip/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            },
            data: {
                amount: amount
            }

        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.putCartTip(amount);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    putCartCoupon: function (couponData) {
        var deferred = jQuery.Deferred();
        $.ajax({
            method: 'PUT',
            url: api.endpoint + "/cart/coupon/",
            data: {
                code: couponData
            },
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.putCartCoupon(couponData);
                })
            } else {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    },

    postCartItem: function (productId, quantity) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'POST',
            url: api.endpoint + "/cart/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            },
            data: {
                product: productId,
                quantity: quantity,
                channel: store.getStoreId()
            }

        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.postCartItem(productId, quantity);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    patchCartItem: function (variantId, quantity) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'PATCH',
            url: api.endpoint + "/cart/item/" + variantId + "/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            },
            data: {
                quantity: quantity,
                channel: store.getStoreId()
            }

        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.patchCartItem(variantId, quantity);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    deleteCartItem: function (variantId) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'DELETE',
            url: api.endpoint + "/cart/item/" + variantId + "/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.deleteCartItem(variantId);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    deleteCart: function () {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'DELETE',
            url: api.endpoint + "/cart/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.deleteCart();
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },


    // PACKS
    addPackToCart: function (data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'POST',
            url: api.endpoint + '/cart/package/',
            data: data,
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.addPackToCart(data);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },


    // STORES
    getStores: function (data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + '/stores/',
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });

        return deferred.promise();
    },


    // CHECKOUT
    putCartStartCheckout: function (order) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'PUT',
            url: api.endpoint + "/cart/checkout/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            },
            data: order
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.putCartStartCheckout(order);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    getCartCheckoutFinalize: function () {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/cart/checkout/finalize/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.getCartCheckoutFinalize();
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    putCartCheckoutFinalize: function () {
        var deferred = jQuery.Deferred();
        var user_ip;
        $.post(api.assetUrl + 'get-user-ip-address/', function(response) {
                user_ip = response;
        }).done(function(){
            $.ajax({
                method: 'PUT',
                url: api.endpoint + "/cart/checkout/finalize/?user_ip=" + encodeURIComponent(user_ip),
                // data: {
                //     // ip: user_ip
                // },
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                if (error.status == 403) {
                    apiHandler.refreshAuth().then(function () {
                        apiHandler.putCartCheckoutFinalize();
                    })
                }
                else {
                    deferred.reject(error);
                }
            });
        });
console.log(user_ip);

        return deferred.promise();
    },


    // CREDIT CARD
    getCreditCards: function () {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/user/credit-cards/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.getCreditCards();
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    postCreditCards: function (token) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'POST',
            url: api.endpoint + "/user/credit-cards/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            },
            data: {
                'token': token
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.postCreditCards(token);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    getDefaultCreditCard: function () {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/user/credit-cards/default/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.getDefaultCreditCard();
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    postDefaultCreditCard: function (cardId) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'POST',
            url: api.endpoint + "/user/credit-cards/default/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            },
            data: {
                'cardId': cardId
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.postDefaultCreditCard(cardId);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },

    deleteCreditCard: function (cardId) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'DELETE',
            url: api.endpoint + "/user/credit-cards/" + cardId + "/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.deleteCreditCard(cardId);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    },


    // USER
    patchUserData: function (data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'PATCH',
            url: api.endpoint + "/user/profile/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            },
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.patchUserData(data);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise()
    },

    getUserData: function () {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'GET',
            url: api.endpoint + "/user/profile/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            },
            data: {}
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.getUserData();
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise()
    },

    patchUserPassword: function (data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'PATCH',
            url: api.endpoint + "/user/change-password/",
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Authorization", user.getUserInfo().accessToken);
            },
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            if (error.status == 403) {
                apiHandler.refreshAuth().then(function () {
                    apiHandler.patchUserPassword(data);
                })
            }
            else {
                deferred.reject(error);
            }
        });

        return deferred.promise()
    },

    postResetPassword: function (data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'POST',
            url: api.endpoint + "/user/reset-password/",
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });

        return deferred.promise()
    },

    putResetPassword: function (data) {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'PUT',
            url: api.endpoint + "/user/reset-password/",
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });

        return deferred.promise()
    },

    refreshAuth: function () {
        var deferred = jQuery.Deferred();

        $.ajax({
            method: 'PATCH',
            url: "/refresh-auth"
        }).success(function (data) {
            user.update(data);
        }).error(function (error) {
            deferred.reject(error);
        });

        return deferred.promise()
    }
};