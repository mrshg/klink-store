
$.extend(true, $.magnificPopup.defaults, {
  preloader: false,
  removalDelay: 500,
  closeOnContentClick: false,
  closeOnBgClick: true,
  enableEscapeKey: true,
  tClose: 'Close (Esc)', // Alt text on close button
  tLoading: '', // Text that is displayed during loading. Can contain %curr% and %total% keys
  gallery: {
    tPrev: 'Previous (Left arrow key)', // Alt text on left arrow
    tNext: 'Next (Right arrow key)', // Alt text on right arrow
    tCounter: '%curr% of %total%' // Markup for "1 of 7" counter
  },
  image: {
    tError: '<a href="%url%">The image</a> could not be loaded.' // Error message when image could not be loaded
  },
  ajax: {
    tError: '<a href="%url%">The content</a> could not be loaded.' // Error message when ajax request failed
  },
   zoom: {
    enabled: true, // By default it's false, so don't forget to enable it
    duration: 300, // duration of the effect, in milliseconds
    easing: 'ease-in-out' // CSS transition easing function
  },
  callbacks: {
      beforeOpen: function () {
          var storeId = this.st.el.attr('data-storeId');
          var packageItem = this.st.el.attr('data-packageItem');
          prePopulateModal(this.st.el.attr('data-id'), this.st.el.attr('href'), storeId, packageItem);
          this.st.mainClass = this.st.el.attr('data-effect');
          $overlay.addClass('blur');
      },
      open: function () {
          if ($('.modal-slider-time-selection').length) {
              initModalTimeSelectionSlider();
          };
          // $.magnificPopup.instance.content.addClass('active');
      },
      beforeClose: function () {
          $overlay.removeClass('blur');
      },
      close: function () {
          if(this.st.el) {
              if (this.st.el.attr('href') == '#initial-address-setup-notlogged') {
                  if (!store.getStoreId()) {
                      storeComp.showSampleStore();
                  }
              }
              else if(this.st.el.attr('href') == '#modal-login') {
                  cart.removeItemInCartNotLogged();
                  cart.removePackInCartNotLogged();
                  $('.modal--password .modal__body').html(
                      '<form class="form form--modal" name="forgot-password" id="forgot-password" action="">' +
                      '<input type="email" name="email" placeholder="Enter your email address" required />'+
                      '<input type="submit" value="Email password reset link" onclick="profileComp.forgotPassword()"/>'+
                      '</form>');
                  $('.modal--password .modal__actions').html('');
              }
          }
      }
  }
});

//=require components/main.js
//=require models/*.js
//=require components/*.js
