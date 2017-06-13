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

    isLoggedIn();
    gap.initPaymentUI();
    //gap.initCardIO();
    var paymentDetails = {
      // Mandatory String. A value more than '1.00'
      'mp_amount': '1.50',

      // Mandatory String. Values obtained from MOLPay
      'mp_username': 'api_accessmobile',
      'mp_password': 'api_SsE874elm#',
      'mp_merchant_ID': 'accessmobile', //'accessmobile_Dev',
      'mp_app_name': 'accessmobileapps',
      'mp_verification_key': '43a8f3fed8653b86170ce8391e597ce8', //'8bb35a1675af8ab240fb172db5aa4263',

      // Mandatory String. Payment values
      'mp_order_ID': '3q3rux7dj',
      'mp_currency': 'MYR',
      'mp_country': 'MY',

      // Optional String.
      'mp_channel': 'multi', // Use 'multi' for all available channels option. For individual channel seletion, please refer to "Channel Parameter" in "Channel Lists" in the MOLPay API Spec for Merchant pdf.
      'mp_bill_description': '',
      'mp_bill_name': '',
      'mp_bill_email': '',
      'mp_bill_mobile': '',
      'mp_channel_editing': true, // Option to allow channel selection.
      'mp_editing_enabled': true, // Option to allow billing information editing.

      // Optional for Escrow
      'mp_is_escrow': '', // Optional for Escrow, put "1" to enable escrow

      // Optional for credit card BIN restrictions
      'mp_bin_lock': [], //['414170', '414171'], // Optional for credit card BIN restrictions
      'mp_bin_lock_err_msg': 'Credit card BIN restrictions', // Optional for credit card BIN restrictions

      // For transaction request use only, do not use this on payment process
      'mp_transaction_id': '', // Optional, provide a valid cash channel transaction id here will display a payment instruction screen.
      'mp_request_type': '', // Optional, set 'Status' when doing a transactionRequest

      // Optional, set the token id to nominate a preferred token as the default selection, set "new" to allow new card only
      'mp_preferred_token': '',

      // Optional, credit card transaction type, set "AUTH" to authorize the transaction
      'mp_tcctype': '',

      // Optional, set true to process this transaction through the recurring api, please refer the MOLPay Recurring API pdf
      'mp_is_recurring': false,

      // Optional for channels restriction
      'mp_allowed_channels': [ /*'credit', 'jompay', 'fpx', 'maybank2u', 'cimb', 'BIMB', 'rhb', 'amb', 'hlb', 'affin-epg', 'MOLPoints', 'Point-BCard', 'Point-Giftcard', 'MOLWallet', 'webcash', 'GPayPal'*/ ],

      // Optional for sandboxed development environment, set boolean value to enable.
      'mp_sandbox_mode': true,

      // Optional, required a valid mp_channel value, this will skip the payment info page and go direct to the payment screen.
      'mp_express_mode': false,

      // Optional, enable this for extended email format validation based on W3C standards.
      'mp_advanced_email_validation_enabled': false,

      // Optional, enable this for extended phone format validation based on Google i18n standards.
      'mp_advanced_phone_validation_enabled': false
    };
    var molpayCallback = function(transactionResult) {
      console.log('molpayCallback transactionResult = ' + transactionResult);
      alert('molpayCallback transactionResult = ' + transactionResult);
    };

    var btnPayment = document.getElementById("btnPayment");
    // btnPayment.onclick = function(e) {
    //   window.molpay.startMolpay(paymentDetails, molpayCallback);
    //   window.molpay.transactionRequest(paymentDetails, molpayCallback);
    //   window.molpay.closeMolpay();
    // };
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

// var app = require('http').createServer(handler)
// var io = require('socket.io')(app);
// var fs = require('fs');
//
// app.listen(80);
//
// function handler (req, res) {
//   fs.readFile(__dirname + '/index.html',
//   function (err, data) {
//     if (err) {
//       res.writeHead(500);
//       return res.end('Error loading index.html');
//     }
//
//     res.writeHead(200);
//     res.end(data);
//   });
// }
//
// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
