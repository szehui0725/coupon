// Initialize app

// if (localStorage.lang === undefined || localStorage.lang === 'undefined') {
//     localStorage.lang = "en";
// }

// var apiKey = "Js-k1aq^ChxN";
// var apiUrl = "http://member.dmallclub.com/api/";
// var jomMain = "http://jom.vvpserver.com";
// var jomApi = "http://jomapi.vvpserver.com";

// var colorArr = ["red", "pink", "purple", "deeppurple", "indigo", "lightblue", "blue", "cyan", "teal", "green", "lightgreen", "lime", "yellow", "amber", "orange", "deeporange", "brown", "bluegray"];

var app = new Framework7({
  modalTitle: "Coupon",
  modalButtonOk: "OK",
  modalButtonCancel: "Cancel",
  modalPreloaderTitle: "",
  precompileTemplates: true,
  template7Pages: true,

  scrollTopOnStatusbarClick: true,
  material: true,
  materialPageLoadDelay: 100,
  sortable: false,
  swipeBackPage: false,
  swipeout: true,
  //swipePanel: true,
  //swipePanelOnlyClose: true
  /*, //list swipe
      imagesLazyLoadPlaceholder: '',
      tapHold: true,*/
  // onAjaxStart: function(xhr) {
  //     app.showIndicator();
  // },
  // onAjaxComplete: function(xhr) {
  //     app.hideIndicator();
  // }
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = app.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  //dynamicNavbar: true
});

var gap = {
  initialize: function() {
    this.bindEvents();
  },
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener("backbutton", this.onBackKeyDown, false);
  },
  onDeviceReady: function() {
    gap.receivedEvent('deviceready');
  },
  receivedEvent: function(id) {
    console.log('Received Event: ' + id);

    /*var push = PushNotification.init({
        android: {
            senderID: senderID,
            clearBadge: true
        },
        ios: {
            alert: "true",
            badge: true,
            sound: 'true',
            clearBadge: true
        }
    });

    push.on('registration', function(data) {
        //device.platform  iOS Android
        //console.log(data.registrationId);
        pushId = data.registrationId;
    });

    push.on('notification', function(data) {
        console.log(data.message);
        console.log(data.title);
        console.log(data.count);
        console.log(data.sound);
        console.log(data.image);
        console.log(data.additionalData);
    });

    appInit();*/
    isLoggedIn();
    gap.initPaymentUI();
    //gap.initCardIO();
  },
  onBackKeyDown: function() {
    mainView.router.back();
  },
  initPaymentUI: function() {
    var clientIDs = {
      "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
      "PayPalEnvironmentSandbox": "YOUR_SANDBOX_CLIENT_ID"
    };
    PayPalMobile.init(clientIDs, gap.onPayPalMobileInit);

  },
  onPayPalMobileInit: function() {
    // must be called
    // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
    PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", gap.configuration(), gap.onPrepareRender);
  },
  configuration: function() {
    // for more options see `paypal-mobile-js-helper.js`
    var config = new PayPalConfiguration({
      merchantName: "My test shop",
      merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
      merchantUserAgreementURL: "https://mytestshop.com/agreement"
    });
    return config;
  },
  onSuccesfulPayment: function(payment) {
    console.log("payment success: " + JSON.stringify(payment, null, 4));
  },
  onAuthorizationCallback: function(authorization) {
    console.log("authorization: " + JSON.stringify(authorization, null, 4));
  },
  createPayment: function() {
    // for simplicity use predefined amount
    var paymentDetails = new PayPalPaymentDetails("50.00", "0.00", "0.00");
    var payment = new PayPalPayment("50.00", "USD", "Awesome Sauce", "Sale", paymentDetails);
    return payment;
  },
  onPrepareRender: function() {},
  onUserCanceled: function(result) {
    console.log(result);
  }
};

function initDatePicker(input, date) {

  var today;
  if (date) {
    today = date;
  } else {
    today = new Date();
  }

  var picker = app.picker({
    input: input,
    toolbar: false,

    onChange: function(picker, values, displayValues) {
      var daysInMonth = new Date(picker.value[0], picker.value[1] * 1 + 1, 0).getDate();
      if (values[1] > daysInMonth) {
        picker.cols[1].setValue(daysInMonth);
      }
    },

    formatValue: function(p, values, displayValues) {
      return values[0] + '-' + displayValues[1] + '-' + values[2];
    },

    cols: [
      // Days
      {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      },
      // Months
      {
        values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
        displayValues: ('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec').split(' '),
        textAlign: 'left'
      },
      // Years
      {
        values: (function() {
          var arr = [];
          for (var i = 1900; i <= 2020; i++) {
            arr.push(i);
          }
          return arr;
        })(),
      }
    ],

    value: [today.getDate(), today.getMonth(), today.getFullYear()]
  });
  picker.open();
  picker.close();
}

// function makeToast(str, icon) {
//     var toast = app.toast(str, icon, {});
//     toast.show(true);
// }
