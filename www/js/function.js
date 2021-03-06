$$(document).on('pageInit', function(e) {
  var page = e.detail.page;
  var pageName = page.name;

  switch (pageName) {
    case (pageName.match(/smart-select-checkbox/) || {}).input:
      break;
    case 'home':
      homeAction();
      break;
    case 'search':
      searchAction();
      break;
    case 'merchant':
      merchantAction();
      break;
    case 'collection':
      // console.log(123);
      collectAction();
      // console.log(123);
      break;
    case 'membership':
      membershipAction();
      break;
    case 'payment':
      paymentAction();
      break;
    case 'share':
      shareAction();
      break;
    case 'qrcode':
      qrcodeAction();
      break;
    case 'chart':
      chartAction();
      break;
    case 'live':
      liveAction();
      break;
    case 'more':
      moreAction();
      break;
    case 'changePassword':
      changePasswordAction();
      break;
    case 'contactUs':
      contactUsAction();
      break;
    case 'editProfile':
      editProfileAction();
      break;
    default:
      break;
  }
});



function showPreloader(msg) {
  app.showPreloader(msg);
}

function hidePreloader() {
  app.hidePreloader();
  return true;
}

function loadPage(url) {
  mainView.router.loadPage(url);
  $$('.home-toolbar a').removeClass('selected');
  $$('.home-toolbar a[href="' + url + '"]').addClass('active');
}

function refreshPage() {
  mainView.router.refreshPage();
}

function restart() {
  window.location = "./index.html";
}

function openUrl(url, name) {
  if (!(/(http(s?))\:\/\//gi.test(url))) {
    url = 'https://' + url;
  }
  app.confirm("Browse to " + (isEmpty(name) ? url : name), function() {
    try {
      var ref = cordova.InAppBrowser.open(encodeURI(url), '_system', 'location=yes');
    } catch (e) {
      window.open(encodeURI(url), '_system');
    }
  });
}

function navigateTo(addr) {
  launchnavigator.navigate(addr);
}

function alertMsg(code, msg) {
  hidePreloader();
  //app.hideIndicator();
  app.alert(msg, function() {
    switch (code) {
      case -1:
        break;
      case 0:
        restart();
        break;
      case 1:
        refreshPage();
        break;
      case 2:
        mainView.router.back();
        break;
      case 9:
        logout(true);
        break;
      case 99:
        gap.clearAppsBadge();
        break;
      default:
        loadPage(code + '.html');
        break;
    }
  });
}

function handleError(msg) {
  hidePreloader();
  if (parseInt(localStorage.errCount) > 5) {
    app.alert("App error", function() {
      localStorage.removeItem('errCount');
      logout(true);
    });
  } else {
    if (msg.code) {
      alertMsg(-1, msg.code);
    } else {
      alertMsg(0, 'Unexpected app error');
    }
    appError();
  }
}

function appError() {
  if (localStorage.errCount === undefined || localStorage.errCount === 'undefined') {
    localStorage.errCount = 1;
  } else {
    localStorage.errCount = parseInt(localStorage.errCount) + 1;
  }
}

function request(type, action, dataObj, callback) {
  //app.showIndicator();
  $$.ajax({
    type: type,
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
      'Auth-Key': localStorage.authkey !== undefined ? localStorage.authkey : ''
    },
    url: apiUrl + action,
    dataType: 'json',
    data: type === 'GET' ? dataObj : dataObj,
    success: callback,
    error: function(res, timeout) {
      if (timeout === 'timeout') {
        alertMsg(-1, 'connection_timeout');
      } else {
        handleError(res);
      }
    }
  });
}

function alt_request(type, url, dataObj, callback) {
  if (type === 'GET' || type === 'get') {
    $$.ajax({
      type: 'GET',
      dataType: 'json',
      url: url,
      success: callback,
      error: function(res, timeout) {
        if (timeout === 'timeout') {
          alertMsg(-1, 'connection_timeout');
        } else {
          handleError(res);
        }
      }
    });
  } else {
    $$.ajax({
      type: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: url,
      dataType: 'json',
      data: dataObj,
      timeout: 7000,
      success: callback,
      error: function(res, timeout) {
        if (timeout === 'timeout') {
          alertMsg(-1, 'connection_timeout');
        } else {
          handleError(res);
        }
      }
    });
  }
}



function uploadFile(uploadUrl, fileUrl) {
  showPreloader("upload_prepare");
  var uri = encodeURI(uploadUrl);

  var options = new FileUploadOptions();
  options.fileKey = "file";
  options.fileName = getFormattedDate(Date(), 'dmyhm');
  options.mimeType = "image/jpeg";

  var headers = {
    'Api-Key': apiKey,
    'Auth-Key': localStorage.authkey !== undefined ? localStorage.authkey : 'testingAuth'
  };

  var params = {};
  params.dataType = "json";

  options.params = params;

  options.headers = headers;

  var ft = new FileTransfer();
  var percent = 0;
  ft.onprogress = function(progressEvent) {

    percent = progressEvent.loaded / progressEvent.total * 100;

    $$('.modal.modal-preloader .modal-title').html(String.format(LANG[localStorage.lang]['ui']['upload_percentage'], Math.round(percent)));

  };
  ft.upload(fileUrl, uri, uploadSuccess, uploadFail, options);
}

function uploadSuccess(res) {

  res = JSON.parse(res.response);
  if (res.status === 'success') {
    alertMsg(-1, 'receipt_upload_success');
  } else {
    alertMsg(-1, 'receipt_upload_fail');
  }
}

function uploadFail(error) {
  alertMsg(-1, 'upload_module_fail');
}

// $$('#cameraTakePicture').on('click', function() {
//     console.log('1');
//     app.closeModal('.popover-update-profile');
//     cameraTakePicture();
// });
//
// $$('#captureEditable').on('click', function() {
//     console.log('2');
//     app.closeModal('.popover-change-pic');
//     capturePhotoEdit();
// });
//
// $$('#fromLibrary').on('click', function() {
//     console.log('3');
//     app.closeModal('.popover-change-pic');
//     getPhoto(Camera.PictureSourceType.PHOTOLIBRARY);
// });
//
// $$('#fromAlbum').on('click', function() {
//     console.log('4');
//     app.closeModal('.popover-change-pic');
//     getPhoto(Camera.PictureSourceType.SAVEDPHOTOALBUM);
// });

var pictureSource; // picture source

var destinationType; // sets the format of returned value

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

  pictureSource = navigator.camera.PictureSourceType;

  destinationType = navigator.camera.DestinationType;

}

function onPhotoDataSuccess(imageData) {

  var smallImage = document.getElementById('smallImage');

  // smallImage.style.display = 'block';

  smallImage.src = "data:image/jpeg;base64," + imageData;

  // var image = document.getElementById('myImage');
  // image.src = "data:image/jpeg;base64," + imageData;

}

function onPhotoURISuccess(imageURI) {

  var largeImage = document.getElementById('largeImage');

  // largeImage.style.display = 'block';

  largeImage.src = imageURI;

}

function capturePhoto() {

  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 50,

    destinationType: destinationType.DATA_URL
  });

}

function capturePhotoEdit() {

  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 20,
    allowEdit: true,

    destinationType: destinationType.DATA_URL
  });

}

function getPhoto(source) {

  navigator.camera.getPicture(onPhotoURISuccess, onFail, {
    quality: 50,

    destinationType: destinationType.FILE_URI,

    sourceType: source
  });

}

function onFail(message) {
  alert('Failed because: ' + message);
}

//
// $$('#cameraTakePicture').on('click', function(){
//   app.closeModal('.popover-update-profile');
//   cameraTakePicture();
// });
//
// // document.getElementById("cameraTakePicture").addEventListener
// //    ("click", cameraTakePicture);
//
// function cameraTakePicture() {
//       navigator.camera.getPicture(onSuccess, onFail, {
//         quality: 100,
//         allowEdit: true,
//         destinationType: Camera.DestinationType.DATA_URL,
//         encodingType: Camera.EncodingType.PNG,
//         correctOrientation: true,
//         targetWidth: 100,
//         targetHeight: 100
//       });
//
//       function onSuccess(imageData) {
//          var image = document.getElementById('myImage');
//          image.src = "data:image/jpeg;base64," + imageData;
//       }
//
//       function onFail(message) {
//          alert('Failed because: ' + message);
//       }
//    }

//  document.getElementById("cameraGetPicture").addEventListener("click", cameraGetPicture);
$$('#cameraGetPicture').on('click', function() {
  app.closeModal('.popover-update-profile');
  cameraGetPicture();
});

function cameraGetPicture() {
  navigator.camera.getPicture(onSuccess, onFail, {
    quality: 100,
    allowEdit: true,
    destinationType: Camera.DestinationType.DATA_URL,
    encodingType: Camera.EncodingType.PNG,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    correctOrientation: true,
    targetWidth: 100,
    targetHeight: 100
  });

  function onSuccess(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
  }

  function onFail(message) {
    alert('Failed because: ' + message);
  }
}

function onPhotoDataSuccess(imageData) {
  $$('#uploadPhotoCheck').val(LANG[localStorage.lang]['ui']['image_valid']);
}

function onPhotoURISuccess(imageURI) {
  console.log(imageURI);
  switch (browseFrom) {
    case 'apply-card-id':
      $$('#textBrowseID .item-after').html('Valid');
      $$('#textBrowseID input').val(imageURI);
      break;
    case 'apply-card-addr':
      $$('#textBrowseAddr .item-after').html('Valid');
      $$('#textBrowseAddr input').val(imageURI);
      break;
  }
}

function capturePhoto() {
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 60,
    destinationType: Camera.DestinationType.DATA_URL,
    encodingType: Camera.EncodingType.PNG,
    correctOrientation: true,
    targetWidth: 100,
    targetHeight: 100
  });
}

function capturePhotoEdit() {
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 100,
    allowEdit: true,
    destinationType: Camera.DestinationType.DATA_URL,
    encodingType: Camera.EncodingType.PNG,
    correctOrientation: true,
    targetWidth: 100,
    targetHeight: 100
  });
}

function getPhoto(source) {
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
    quality: 100,
    allowEdit: true,
    destinationType: Camera.DestinationType.DATA_URL,
    encodingType: Camera.EncodingType.PNG,
    sourceType: source,
    correctOrientation: true,
    targetWidth: 100,
    targetHeight: 100
  });
}

function onFail(message) {
  $$('#uploadPhotoCheck').val(LANG[localStorage.lang]['ui']['image_invalid']);
}

function handleOpenURL(url) {
  url = url.replace('dmall://', '').split('?');
  for (var i = 0; i < url.length; i++) {
    console.log(url[i]);
  }
  switch (url[0]) {
    case 'register':
      app.popup('.popup-register-form');
      var referral = url[1].replace('referral=', '');
      $$('#regReferral').val(referral);
      checkReferral(referral);
      break;
    default:
      loadPage('userHome.html');
      break;
  }
}

function applyLanguage() {
  var regex = /\[\[([a-zA-Z])\w+\]\]/g;
  var elements = document.getElementsByClassName('lang');
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].innerHTML.match(regex)) {
      elements[i].innerHTML = translate(elements[i].innerHTML.replace(/[\[\]]/g, ''));
    }
    if ((elements[i].tagName === 'INPUT' || elements[i].tagName === 'TEXTAREA') && elements[i].placeholder.match(regex)) {
      elements[i].placeholder = translate(elements[i].placeholder.replace(/[\[\]]/g, ''));
    }
  }
}

function applyPageLanguage(name) {
  var regex = /\[\[([a-zA-Z])\w+\]\]/g;

  var elements = $$('.page[data-page="' + name + '"] .lang');
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].innerHTML.match(regex)) {
      elements[i].innerHTML = translate(elements[i].innerHTML.replace(/[\[\]]/g, ''));
    }
    if ((elements[i].tagName === 'INPUT' || elements[i].tagName === 'TEXTAREA') && elements[i].placeholder.match(regex)) {
      elements[i].placeholder = translate(elements[i].placeholder.replace(/[\[\]]/g, ''));
    }
  }
}

function openImageBrowser(url) {
  var urlRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

  if (Array.isArray(url) && url.length > 0 && urlRegex.test(url[0])) {
    var myPhotoBrowserPopupDark = app.photoBrowser({
      photos: url,
      theme: 'dark'
    });
    myPhotoBrowserPopupDark.open();
  } else if (urlRegex.test(url) || url.indexOf('img') === 0) {
    var images = [];
    images.push(url);

    var myPhotoBrowserPopupDark = app.photoBrowser({
      photos: images,
      theme: 'dark'
    });
    myPhotoBrowserPopupDark.open();
  } else {
    alertMsg(-1, 'no_image_available');
  }
}

$$('.home-toolbar a').on('click', function(e, i) {
  $$('.home-toolbar a').removeClass('selected');
  $$(this).addClass('selected');
});

function liveAction(){
  var quote = {};

  var createDom = function(pair) {
  	var wrapper = document.getElementById("content");
  	var div = document.createElement("div");
  	var html = '<div class="wrapper">';
  	html += '<h1><span id="fsym_'+ pair +'"></span> - <span id="tsym_'+ pair +'"></span>   <strong><span class="price" id="price_'+ pair +'"></span></strong></h1>';
  	html += '<div class="label">24h Change: <span class="value" id="change_'+ pair +'"></span> (<span class="value" id="changepct_'+ pair +'"></span>)</div>';
  	html += '<div class="label">Last Market: <span class="market" id="market_'+ pair +'"></span></div>';
  	html += '<div class="label">Last Trade Id: <span class="value" id="tradeid_'+ pair +'"></span></div>';
  	html += '<div class="label">Last Trade Volume: <span class="value" id="volume_'+ pair +'"></span></div>';
  	html += '<div class="label">Last Trade VolumeTo: <span class="value" id="volumeto_'+ pair +'"></span></div>';
  	html += '<div class="label">24h Volume: <span class="value" id="24volume_'+ pair +'"></span></div>';
  	html += '<div class="label">24h VolumeTo: <span class="value" id="24volumeto_'+ pair +'"></span></div>';
  	html += '<div class="source"> Source: <a href="http://www.cryptocompare.com">CryptoCompare</a></div>';
  	html += '</div>';
  	div.innerHTML = html;
  	wrapper.appendChild(div);
  };

  var displayQuote = function(_quote) {

  	var fsym = CCC.STATIC.CURRENCY.SYMBOL[_quote.FROMSYMBOL];
  	var tsym = CCC.STATIC.CURRENCY.SYMBOL[_quote.TOSYMBOL];
  	var pair = _quote.FROMSYMBOL + _quote.TOSYMBOL;
  	console.log(_quote);
  	console.log(pair);
  	document.getElementById("market_" + pair).innerHTML = _quote.LASTMARKET;
  	document.getElementById("fsym_" + pair).innerHTML = _quote.FROMSYMBOL;
  	document.getElementById("tsym_" + pair).innerHTML = _quote.TOSYMBOL;
  	document.getElementById("price_" + pair).innerHTML = _quote.PRICE;
  	document.getElementById("volume_" + pair).innerHTML = CCC.convertValueToDisplay(fsym, _quote.LASTVOLUME);
  	document.getElementById("volumeto_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.LASTVOLUMETO);
  	document.getElementById("24volume_" + pair).innerHTML = CCC.convertValueToDisplay(fsym, _quote.VOLUME24HOUR);
  	document.getElementById("24volumeto_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.VOLUME24HOURTO);
  	document.getElementById("tradeid_" + pair).innerHTML = _quote.LASTTRADEID.toFixed(0);
  	document.getElementById("tradeid_" + pair).innerHTML = _quote.LASTTRADEID.toFixed(0);
  	document.getElementById("change_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.CHANGE24H);
  	document.getElementById("changepct_" + pair).innerHTML = _quote.CHANGEPCT24H.toFixed(2) + "%";

  	if (quote.FLAGS === "1"){
  		document.getElementById("price").className = "up";
  	}
  	else if (quote.FLAGS === "2") {
  		document.getElementById("price").className = "down";
  	}
  	else if (quote.FLAGS === "4") {
  		document.getElementById("price").className = "";
  	}
  }

  var updateQuote = function(result) {

  	var keys = Object.keys(result);
  	var pair = result.FROMSYMBOL + result.TOSYMBOL;
  	if (!quote.hasOwnProperty(pair)) {
  		quote[pair] = {}
  		createDom(pair);
  	}
  	for (var i = 0; i <keys.length; ++i) {
  		quote[pair][keys[i]] = result[keys[i]];
  	}
  	quote[pair]["CHANGE24H"] = quote[pair]["PRICE"] - quote[pair]["OPEN24HOUR"];
  	quote[pair]["CHANGEPCT24H"] = quote[pair]["CHANGE24H"]/quote[pair]["OPEN24HOUR"] * 100;
  	displayQuote(quote[pair]);
  }

  var socket = io.connect('https://streamer.cryptocompare.com/');

  //Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
  //Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
  //For aggregate quote updates use CCCAGG as market
  var subscription = ['5~CCCAGG~BTC~USD','5~CCCAGG~ETH~USD'];

  socket.emit('SubAdd', {subs:subscription} );

  socket.on("m", function(message){
  	var messageType = message.substring(0, message.indexOf("~"));
  	var res = {};
  	if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
  		res = CCC.CURRENT.unpack(message);
  		console.log(res);
  		updateQuote(res);
  	}
  });

  var count = 10;
  var data = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [{
        fillColor: "rgba(220,220,220,0.5)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        data: [65, 59, 90, 81, 56, 45, 30, 20, 3, 37]
      }
    ]
  }

    socket.on('trade', function(res) {
      console.log(res.LASTVOLUMETO);
      //console.log(res.price);
      // var labels = oldData["labels"];
      // var dataSetA = oldData["datasets"][0]["data"];
      data.labels.shift();
      // count++;
      data.labels.push(res.PRICE);
      // var newDataA = dataSetA[9] + (20 - Math.floor(Math.random() * (41)));
      data.datasets.data.push(res.LASTVOLUMETO);
      data.datasets.shift();
    });

  var optionsAnimation = {
    scaleOverride: true,
    scaleSteps: 10,
    scaleStepWidth: 10,
    scaleStartValue: 0
  }

  var ctx = document.getElementById("lChart").getContext("2d");
  var optionsNoAnimation = {
    animation: false
  }
  var myNewChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: optionsAnimation
  });
}

function chartAction() {

  // var buTicker = io.connect('https://api.hitbtc.com:8081/trades/BTCUSD');
  // buTicker.on('trade', function (data) {
  //   console.log('BTCUSD main ' + JSON.stringify(data));
  // });

  const CHART = document.getElementById("lineChart");
  var lineChart = new Chart(CHART, {
    type: 'line',
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [{
        label: "My First dataset",
        fill: false,
        lineTension: 0.1,
        // backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(255, 99, 132)',
        pointHoverBorderColor: 'rgb(255, 99, 132)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 5,
        data: [50, 10, 5, 2, 20, 30, 45],
      }]
    },
    options: {
      // showLines: false,
      scales: {
        yAxes: [{
          ticks: {
            // reverse:false,
            beginAtZero: true
          }
        }]
      }
    }
  });

  $$('#addPoint').on('click', function() {
    lineChart.data.labels.push("label");
    lineChart.data.datasets.forEach((dataset) => {
      dataset.data.push(20);
    });
    lineChart.update();
  });

  $$('#removePoint').on('click', function() {
    lineChart.data.labels.pop();
    lineChart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    lineChart.update();
  });

  const BAR = document.getElementById("barChart");
  Chart.defaults.scale.ticks.beginAtZero = true;

  let barChart = new Chart(BAR, {
    type: 'bar',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [{
        label: 'Numbers per month',
        borderColor: '#00FF00',
        borderWidth: 2,
        backgroundColor: '#00FF00',
        data: [10, 20, 30, 40, 50]
      }]
    }
  });

  const RADAR = document.getElementById("radar");
  Chart.defaults.scale.ticks.beginAtZero = true;

  let radar = new Chart(RADAR, {
    type: 'radar',
    data: {
      labels: ["Strength", "Skill", "Health", "Speed", "Luck"],
      datasets: [{
        label: 'Points',
        borderColor: '#00FF00',
        borderWidth: 2,
        backgroundColor: 'rgba(00, 255, 00, 0.1)',
        data: [10, 20, 30, 40, 50]
      }, {
        label: 'Points',
        borderColor: '#00FFFF',
        borderWidth: 2,
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        data: [100, 60, 30, 80, 50]
      }]
    }
  });

  const POLAR = document.getElementById("polar");
  Chart.defaults.scale.ticks.beginAtZero = true;

  let polar = new Chart(POLAR, {
    type: 'polarArea',
    data: {
      labels: ["Strength", "Skill", "Health", "Speed", "Luck"],
      datasets: [{
        label: 'Points',
        backgroundColor: ['#f1c40f', '#e67e22', '#16a085', '#2980b9', '#8e44ad'],
        data: [10, 20, 30, 40, 50]
      }]
    },
    options: {
      animation: {
        // animateRotate: false
        animateScale: false
      }
    }
  });

  const PIE = document.getElementById("pie");
  Chart.defaults.scale.ticks.beginAtZero = true;

  let pie = new Chart(PIE, {
    type: 'pie',
    data: {
      labels: ["Strength", "Skill", "Health", "Speed", "Luck"],
      datasets: [{
        label: 'Points',
        backgroundColor: ['#f1c40f', '#e67e22', '#16a085', '#2980b9', '#8e44ad'],
        data: [10, 20, 30, 40, 50]
      }]
    },
    options: {
      animation: {
        // animateRotate: false
        animateScale: true
      }
    }
  });

  const DOUGHNUT = document.getElementById("doughnut");
  Chart.defaults.scale.ticks.beginAtZero = true;

  let doughnut = new Chart(DOUGHNUT, {
    type: 'doughnut',
    data: {
      labels: ["Strength", "Skill", "Health", "Speed", "Luck"],
      datasets: [{
        label: 'Points',
        backgroundColor: ['#f1c40f', '#e67e22', '#16a085', '#2980b9', '#8e44ad'],
        data: [10, 20, 30, 40, 50]
      }]
    },
    options: {
      cutoutPercentage: 20,
      rotation: Math.PI * 0.5,
      // rotation: 90,
      animation: {
        // animateRotate: false
        animateScale: true
      }
    }
  });

  const LOGIC = document.getElementById("logic");
  Chart.defaults.scale.ticks.beginAtZero = true;

  let logic = new Chart(LOGIC, {
    type: 'line',
    data: {
      labels: ["Strength", "Skill", "Health", "Speed", "Luck"],
      datasets: [{
        label: 'Points',
        borderColor: '#2980b9',
        data: [10, 20, 55, 30, 10]
      }]
    },
    options: {
      scales: {
        yAxes: [{
          type: 'logarithmic',
          ticks: {
            min: 1,
            max: 60
          }
        }]
      }
    }
  });
}

function qrcodeAction() {
  $$('#qrCode').on('click', function() {
    // window.plugins.barcodeScanner.scan(
    //      function (result) {
    //          alert("We got a barcode\n" +
    //                "Result: " + result.text + "\n" +
    //                "Format: " + result.format + "\n" +
    //                "Cancelled: " + result.cancelled);
    //      },
    //      function (error) {
    //          alert("Scanning failed: " + error);
    //      },
    //      {
    //          preferFrontCamera : true, // iOS and Android
    //          showFlipCameraButton : true, // iOS and Android
    //          showTorchButton : true, // iOS and Android
    //          torchOn: true, // Android, launch with the torch switched on (if available)
    //          prompt : "Place a barcode inside the scan area", // Android
    //          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
    //          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
    //          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
    //          disableAnimations : true, // iOS
    //          disableSuccessBeep: false // iOS
    //      }
    //   );
    cordova.plugins.barcodeScanner.scan(
      function(result) {
        if (!result.cancelled) {
          // In this case we only want to process QR Codes
          if (result.format == "QR_CODE") {
            var value = result.text;
            // This is the retrieved content of the qr code
            alert(value);
          } else {
            alert("Sorry, only qr codes this time ;)");
          }
        } else {
          alert("The user has dismissed the scan");
        }
      },
      function(error) {
        alert("An error ocurred: " + error);
      }, {
        "preferFrontCamera": false, // iOS and Android
        "showFlipCameraButton": true, // iOS and Android
        "prompt": "Place parallel to the code", // supported on Android only
        "formats": "all,RSS_EXPANDED,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        "orientation": "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
      }
    );
  });
}

// cordova.plugins.barcodeScanner.scan(
//    function (result) {
//         if(!result.cancelled){
//                // In this case we only want to process QR Codes
//                if(result.format == "QR_CODE"){
//                     var value = result.text;
//                     // This is the retrieved content of the qr code
//                     console.log(value);
//                }else{
//                   alert("Sorry, only qr codes this time ;)");
//                }
//         }else{
//           alert("The user has dismissed the scan");
//         }
//      },
//      function (error) {
//           alert("An error ocurred: " + error);
//      }
// );

function paymentAction() {
  $$('#buyNowBtn').on('click', function() {
    PayPalMobile.renderSinglePaymentUI(gap.createPayment(), gap.onSuccesfulPayment, gap.onUserCanceled);
    // PayPalMobile.renderSinglePaymentUI(gap.createPayment("50.00", "0.00", "0.00", "50.00", "Test"), gap.onSuccesfulPayment, gap.onUserCanceled);
  });

  $$('#buyInFutureBtn').on('click', function() {
    PayPalMobile.renderFuturePaymentUI(gap.onAuthorizationCallback, gap.onUserCanceled);
    // PayPalMobile.renderFuturePaymentUI(gap.onAuthorizationCallback, gap.onUserCanceled);
  });

  $$('#profileSharingBtn').on('click', function() {
    PayPalMobile.renderProfileSharingUI(["profile", "email", "phone", "address", "futurepayments", "paypalattributes"], gap.onAuthorizationCallback, gap.onUserCanceled);
    // PayPalMobile.renderProfileSharingUI(["openid", "profile", "email", "phone", "address", "futurepayments", "paypalattributes"], gap.onAuthorizationCallback, gap.onUserCanceled);
  });

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

  $$('#molpay').on('click', function() {
    window.molpay.startMolpay(paymentDetails, molpayCallback);
    // window.molpay.transactionRequest(paymentDetails, molpayCallback);
    // window.molpay.closeMolpay();
  });
}

function shareAction() {
  $$('#fbShare').on('click', function() {
    window.plugins.socialsharing.shareViaFacebook('Message via Facebook',
      'https://www.google.nl/images/srpr/logo4w.png' /* img */ ,
      'http://twitter.com/',
      null,
      function(errormsg) {
        alert("Error: Cannot Share")
      }
    );
  });

  $$('#twitterShare').on('click', function() {
    window.plugins.socialsharing.shareViaTwitter('Message via Twitter',
      null /* img */ ,
      'http://twitter.com/',
      null,
      function(errormsg) {
        alert("Error: Cannot Share")
      }
    );
  });

  $$('#whatsappShare').on('click', function() {
    window.plugins.socialsharing.shareViaWhatsApp('Message via WhatsApp',
      null /* img */ ,
      "http://pointdeveloper.com/" /* url */ ,
      null,
      function(errormsg) {
        alert("Error: Cannot share")
      }
    );
  });

  $$('#otherShare').on('click', function() {
    window.plugins.socialsharing.share('General share Message', null, null, null);
  });
}

function homeAction() {
  $$('.home-toolbar .link[href="userHome.html"]').addClass('selected');

  // $$(":button").on('click', function () {
  //     var gValue = $$(this).attr('class');
  //     if (gValue == 'orange') {
  //         $$(this).removeClass("orange");
  //         $$(this).addClass("red");
  //     } else {
  //         $$(this).removeClass("red");
  //         $$(this).addClass("orange");
  //     }
  // });
  // var bannerSwiper = app.swiper('.banner-swiper', {
  //     autoplay: 1000,
  //     speed: 1000,
  //     lazyLoading: true,
  //     preloadImages: true,
  //     loop: true,
  //     autoplayDisableOnInteraction: false,
  //     pagination: '.banner-pagination',
  // });

  // $$('.banner-swiper .swiper-slide').on('click', function() {
  //     console.log($$(this).prop('id'));
  // });
  localforage.setItem('voucher', VOUCHER, function(result) {
    // console.log(result);
  });

  localforage.getItem('voucher').then(function(result) {
    var html = '';
    for (var prop in result) {
      if (result.hasOwnProperty(prop)) {
        html += '<div class="card news-card" id="' + prop + '">' +
          '<div class="card-header" style="padding-left: 0px; padding-right: 0px;">' +
          '<img src= ' + result[prop].newsImage + ' width="100%" height="150px">' +
          '<p id="day">' + result[prop].day +
          '</p>' +
          '</div>' +
          '<div class="card-content">' +
          '<div class="card-content-inner">' +
          '<p id="vtitle">' + result[prop].title +
          '</p>' +
          '<div class="item-comment">' +
          '<div class="item-title" id="vdescription">' + result[prop].description + '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';
      }
    }
    $$('.news-page').html(html);

    $$('.news-page .card').on('click', function() {
      var id = $$(this).prop('id');
      localStorage.item = id;
      // localforage.setItem('id', VOUCHER, function(result) {
      //     console.log(result);
      // });
      $$('.popup-voucher-detail .navbar .center').html(VOUCHER[id].title);
      $$('.popup-voucher-detail .content-block img').attr('src', 'img/' + id + '.jpg');
      $$('.popup-voucher-detail .content-block table .description').html(VOUCHER[id].description);
      $$('.popup-voucher-detail .content-block table .detail').html(VOUCHER[id].detail);
      $$('.popup-voucher-detail .content-block table .condition').html(VOUCHER[id].condition);
      $$('.popup-voucher-detail .content-block .row .col-50 img').attr('src', VOUCHER[id].image);
      $$('.popup-voucher-detail .content-block .row .col-50 img#two').attr('src', VOUCHER[id].image1);
      $$('.popup-voucher-detail .content-block .row .col-50 img#three').attr('src', VOUCHER[id].image2);
      $$('.popup-voucher-detail .content-block .row .col-50 img#four').attr('src', VOUCHER[id].image3);
      app.popup('.popup-voucher-detail');

    });
  });

  localforage.setItem('pvoucher', PVOUCHER, function(result) {
    // console.log(result);
  });

  localforage.getItem('pvoucher').then(function(result) {
    var html = '';
    for (var prop in result) {
      if (result.hasOwnProperty(prop)) {
        html += '<div class="card news-card" id="' + prop + '">' +
          '<div class="card-header" style="padding-left: 0px; padding-right: 0px;">' +
          '<img src= ' + result[prop].newsImage + ' width="100%" height="150px">' +
          '<p id="day">' + result[prop].day +
          '</p>' +
          '</div>' +
          '<div class="card-content">' +
          '<div class="card-content-inner">' +
          '<p id="vtitle">' + result[prop].title +
          '</p>' +
          '<div class="item-comment">' +
          '<div class="item-title" id="vdescription">' + result[prop].description + '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';
      }
    }
    $$('.popular-page').html(html);

    $$('.popular-page .card').on('click', function() {
      var id = $$(this).prop('id');
      localStorage.item = id;
      $$('.popup-voucher-detail .navbar .center').html(PVOUCHER[id].title);
      $$('.popup-voucher-detail .content-block img').attr('src', 'img/' + id + '.jpg');
      $$('.popup-voucher-detail .content-block table .description').html(PVOUCHER[id].description);
      $$('.popup-voucher-detail .content-block table .detail').html(PVOUCHER[id].detail);
      $$('.popup-voucher-detail .content-block table .condition').html(PVOUCHER[id].condition);
      $$('.popup-voucher-detail .content-block .row .col-50 img').attr('src', PVOUCHER[id].image);
      $$('.popup-voucher-detail .content-block .row .col-50 img#two').attr('src', PVOUCHER[id].image1);
      $$('.popup-voucher-detail .content-block .row .col-50 img#three').attr('src', PVOUCHER[id].image2);
      $$('.popup-voucher-detail .content-block .row .col-50 img#four').attr('src', PVOUCHER[id].image3);
      app.popup('.popup-voucher-detail');
    });
  });

  localforage.setItem('fvoucher', FVOUCHER, function(result) {
    // console.log(result);
  });

  localforage.getItem('fvoucher').then(function(result) {
    var html = '';
    for (var prop in result) {
      if (result.hasOwnProperty(prop)) {
        html += '<div class="card news-card" id="' + prop + '">' +
          '<div class="card-header" style="padding-left: 0px; padding-right: 0px;">' +
          '<img src= ' + result[prop].newsImage + ' width="100%" height="150px">' +
          '<p id="day">' + result[prop].day +
          '</p>' +
          '</div>' +
          '<div class="card-content">' +
          '<div class="card-content-inner">' +
          '<p id="vtitle">' + result[prop].title +
          '</p>' +
          '<div class="item-comment">' +
          '<div class="item-title" id="vdescription">' + result[prop].description + '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';
      }
    }
    $$('.free-page').html(html);

    $$('.free-page .card').on('click', function() {
      var id = $$(this).prop('id');
      localStorage.item = id;
      $$('.popup-voucher-detail .content-block #test').attr('data', FVOUCHER[id]);
      // <i class="fa fa-heart" class="black" id="addWishlist" ></i>
      $$('.popup-voucher-detail .navbar .center').html(FVOUCHER[id].title);
      $$('.popup-voucher-detail .content-block img').attr('src', 'img/' + id + '.jpg');
      $$('.popup-voucher-detail .content-block table .description').html(FVOUCHER[id].description);
      $$('.popup-voucher-detail .content-block table .detail').html(FVOUCHER[id].detail);
      $$('.popup-voucher-detail .content-block table .condition').html(FVOUCHER[id].condition);
      $$('.popup-voucher-detail .content-block .row .col-50 img').attr('src', FVOUCHER[id].image);
      $$('.popup-voucher-detail .content-block .row .col-50 img#two').attr('src', FVOUCHER[id].image1);
      $$('.popup-voucher-detail .content-block .row .col-50 img#three').attr('src', FVOUCHER[id].image2);
      $$('.popup-voucher-detail .content-block .row .col-50 img#four').attr('src', FVOUCHER[id].image3);
      app.popup('.popup-voucher-detail');
    });
  });
}

var FVOUCHER = {
  "f1": {
    "title": "Gift voucher",
    "day": "5 days",
    "newsImage": "img/f1.jpg",
    "description": "Get RM 100 cash voucher",
    "image": "img/f1.jpg",
    "image1": "img/c2.jpg",
    "image2": "img/v1.jpg",
    "image3": "img/m1.jpg",
    "detail": "shadashdhbasbdadsa",
    "condition": "hsjdashdajshdewesad"
  },
  "f2": {
    "title": "Gift voucher",
    "day": "10 days",
    "newsImage": "img/f2.jpg",
    "description": "Get RM 100 cash voucher",
    "detail": "shadashdhbasbdadsa",
    "image": "img/f1.jpg",
    "image1": "img/c2.jpg",
    "image2": "img/v1.jpg",
    "image3": "img/m1.jpg",
    "condition": "hsjdashdajshdewesad"
  },
  "f3": {
    "title": "Gift voucher",
    "day": "14 days",
    "newsImage": "img/f3.jpg",
    "description": "Las Rada",
    "image": "img/f1.jpg",
    "image1": "img/c2.jpg",
    "image2": "img/v1.jpg",
    "image3": "img/m1.jpg",
    "detail": "shadashdhbasbdadsa",
    "condition": "hsjdashdajshdewesad"
  }
};
// $$('#test').on('click', function() {
//     var n = localStorage.item;
//     var ftitle = FVOUCHER[n].title;
//     var fdescription = FVOUCHER[n].description;
//
//     var stored = JSON.parse(localStorage.getItem("obj"));
//     if (stored == null) {
//         stored = [];
//     }
//
//     stored.push(ftitle);
//     stored.push(fdescription);
//     localStorage.setItem("obj", JSON.stringify(stored));
//     // console.log(typeof stored);
// });
//
var PVOUCHER = {
  "p1": {
    "title": "Bike park voucher",
    "day": "5 days",
    "newsImage": "img/p1.jpg",
    "description": "Get RM 30 cash voucher",
    "image": "img/f1.jpg",
    "image1": "img/c2.jpg",
    "image2": "img/v1.jpg",
    "image3": "img/m1.jpg",
    "detail": "shadashdhbasbdadsa",
    "condition": "hsjdashdajshdewesad"
  },
  "p2": {
    "title": "Family life",
    "day": "10 days",
    "newsImage": "img/p2.jpg",
    "description": "Get RM 10 cash voucher",
    "image": "img/f1.jpg",
    "image1": "img/c2.jpg",
    "image2": "img/v1.jpg",
    "image3": "img/m1.jpg",
    "detail": "shadashdhbasbdadsa",
    "condition": "hsjdashdajshdewesad"
  },
  "p3": {
    "title": "Hight voucher",
    "day": "14 days",
    "newsImage": "img/p3.jpg",
    "description": "Richard nash",
    "image": "img/f1.jpg",
    "image1": "img/c2.jpg",
    "image2": "img/v1.jpg",
    "image3": "img/m1.jpg",
    "detail": "shadashdhbasbdadsa",
    "condition": "hsjdashdajshdewesad"
  }
};
// $$('#test').on('click', function() {
//     var n = localStorage.item;
//     var ptitle = PVOUCHER[n].title;
//     var pdescription = PVOUCHER[n].description;
//
//     var stored = JSON.parse(localStorage.getItem("obj"));
//     if (stored == null) {
//         stored = [];
//     }
//
//     stored.push(ptitle);
//     stored.push(pdescription);
//     localStorage.setItem("obj", JSON.stringify(stored));
//     // console.log(typeof stored);
// });

var VOUCHER = {
  "v1": {
    "title": "Glasgow Angling Centre",
    "day": "5 days",
    "newsImage": "img/v1.jpg",
    "description": "Get RM 50 cash voucher",
    "image": "img/f1.jpg",
    "image1": "img/c2.jpg",
    "image2": "img/v1.jpg",
    "image3": "img/m1.jpg",
    "detail": "Come and meet Daiwa consultants Steve Souter and Hywel Morgan as well as checking out the latest Daiwa products at the Glasgow Angling Centre Open weekend between the 2nd and 4th of March 2012.",
    "condition": "Glasgow Angling Centre are completely dedicated to your total satisfaction. If you have any suggestions or comments please email us using the link on the store page. "
  },
  "v2": {
    "title": "Metro",
    "day": "10 days",
    "newsImage": "img/v2.jpg",
    "description": "Get RM 10 cash voucher",
    "image": "img/f1.jpg",
    "image1": "img/c2.jpg",
    "image2": "img/v1.jpg",
    "image3": "img/m1.jpg",
    "detail": "shadashdhbasbdadsa",
    "condition": "hsjdashdajshdewesad"
  },
  "v3": {
    "title": "Water sports",
    "day": "14 days",
    "newsImage": "img/v3.jpg",
    "description": "Mission bay water sports",
    "image": "img/f1.jpg",
    "image1": "img/c2.jpg",
    "image2": "img/v1.jpg",
    "image3": "img/m1.jpg",
    "detail": "shadashdhbasbdadsa",
    "condition": "hsjdashdajshdewesad"
  }
};

$$('#test').on('click', function() {
  var n = localStorage.item;

  // var dtitle = VOUCHER[n].title;
  // var ddescription = VOUCHER[n].description;

  var stored = JSON.parse(localStorage.getItem("obj"));
  if (stored == null) {
    stored = [];
  }

  stored.push(n);
  // stored.push(ddescription);
  localStorage.setItem("obj", JSON.stringify(stored));
  // console.log(typeof stored);
});

function collectAction() {
  var object = JSON.parse(localStorage.getItem("obj"));

  for (var i = 0; i < object.length; i++) {
    $$('#title').append(VOUCHER[object[i]].title + '<br>' + VOUCHER[object[i]].description + '<br><br>');
  }
}

function searchAction() {
  var CATEGORY = {
    "c1": {
      "name": "Health & Fitness",
      "title": "Hight voucher",
      "description": "Get RM 100 cash voucher",
      "image1": "img/p1.jpg",
      "title1": "voucher",
      "description1": "Get RM 100 cash voucher"
    },
    "c2": {
      "name": "Cafe & Dessert Outlet",
      "title": "Cafe voucher",
      "description": "Get RM 100 cash voucher",
      "image1": "img/p2.jpg",
      "title1": "voucher",
      "description1": "Get RM 100 cash voucher"
    },
    "c3": {
      "name": "Electronic & Appliances",
      "title": "Electronic voucher",
      "description": "Get RM 100 cash voucher",
      "image1": "img/p3.jpg",
      "title1": "voucher",
      "description1": "Get RM 100 cash voucher"
    }
  };

  localforage.setItem('category', CATEGORY, function(result) {
    console.log(result);
  });

  localforage.getItem('category').then(function(result) {
    var html = '';
    for (var prop in result) {
      if (result.hasOwnProperty(prop)) {
        html += '<li>' +
          '<a href="#" class="item-content item-link" id="' + prop + '" style="width: 100%;">' +
          '<div class="item-inner">' +
          '<div class="item-title" style="color: black;font-size: 16px;line-height: 48px;">' + result[prop].name +
          '</div>' +
          '</div>' +
          '</a>' +
          '</li>';
      }
    }

    $$('.category ul').html(html);

    $$('.category .item-link').on('click', function() {
      var id = $$(this).prop('id');
      $$('.popup-recent-added-category-detail .navbar .center').html(CATEGORY[id].name);
      $$('.popup-recent-added-category-detail .content-block img').attr('src', 'img/' + id + '.jpg');
      $$('.popup-recent-added-category-detail .content-block table .title').html(CATEGORY[id].title);
      $$('.popup-recent-added-category-detail .content-block table .description').html(CATEGORY[id].description);
      $$('.popup-recent-added-category-detail .content-block img#two').attr('src', CATEGORY[id].image1);
      $$('.popup-recent-added-category-detail .content-block table .title1').html(CATEGORY[id].title1);
      $$('.popup-recent-added-category-detail .content-block table .description1').html(CATEGORY[id].description1);
      app.popup('.popup-recent-added-category-detail');
    });
  });

  var item = [{
    name: "dessert",
    price: "29.9"
  }, {
    name: "car voucher",
    price: "10"
  }, {
    name: "book",
    price: "15"
  }, {
    name: "iphone discount",
    price: "30"
  }, {
    name: "food",
    price: "10"
  }];


  $$('input[name="rangeFrom"]').on('change', function() {
    var value = parseFloat(parseFloat($$(this).val()).toFixed(2));
    $$('input[name="rangeFromTxt"]').val("RM " + value);
    $$('input[name="rangeTo"]').attr('min', (value));
    $$('input[name="rangeTo"]').attr('max', (value + 100));
  });

  $$('input[name="rangeTo"]').on('change', function() {
    var value = $$(this).val();
    $$('input[name="rangeToTxt"]').val("RM " + value);
    $$('input[name="rangeFrom"]').attr('min', (0));
    $$('input[name="rangeFrom"]').attr('max', (value));
  });

  var results = [];
  $$('#btnPassSubmit').on('click', function() {

    var search = $$('input[name="itemName"]').val();
    var from = $$('input[name="rangeFrom"]').val();
    var to = $$('input[name="rangeTo"]').val();

    var i = 0;
    var max = item.length;
    var patt = new RegExp(search);

    for (var i = 0; i < max; i++) {
      if (patt.test(item[i].name) && parseFloat(item[i].price) >= parseFloat(from) && parseFloat(item[i].price) <= parseFloat(to)) {
        results.push(item[i]);
      }
    }

    console.log(results.length > 0 ?
      results : "No result");
  });
}

function membershipAction() {
  var MEMBERSHIP = {
    "m1": {
      "title": "Chamber",
      "newsImage": "img/m1.jpg",
      "term": "min purchace rm30. discount 20%. in a single receipt.",
      "outlet": "Lot 1.08, Level 1, Pavilion KL, Jalan Bukit Bintang ",
      "description": "Chambers of commerce, a business network with local, regional, national, international and bi-lateral Chambers. Chambers of parliament, in politics. Debate chamber, the space or room that houses deliberative assemblies such as legislatures, parliaments, or councils."
    },
    "m2": {
      "title": "Skymiles",
      "newsImage": "img/m2.jpg",
      "term": "min purchace rm30. discount 20%. in a single receipt.",
      "outlet": "Lot 1.08, Level 1, Pavilion KL, Jalan Bukit Bintang ",
      "description": "EARN MILES THAT DON'T EXPIRE. Miles are easy to earn and easy to use; No black out dates on Delta Air Lines flights; One Way Award Tickets start at just ..."
    },
    "m3": {
      "title": "Diamond member",
      "newsImage": "img/m3.jpg",
      "term": "min purchace rm30. discount 20%. in a single receipt.",
      "outlet": "Lot 1.08, Level 1, Pavilion KL, Jalan Bukit Bintang ",
      "description": "Hilton Honors members get the lowest price on any weekend getaway. ..... If you are a Hilton Honors guest with Diamond status, you and up to one additional ..."
    }
  };

  localforage.setItem('membership', MEMBERSHIP, function(result) {
    console.log(result);
  });

  localforage.getItem('membership').then(function(result) {
    var html = '';
    for (var prop in result) {
      if (result.hasOwnProperty(prop)) {
        html +=
          '<div class="col-50">' +
          '<a href="#" class="item-link item-content" id="' + prop + '">' +
          '<div class="item-inner">' +
          '<div class="item-title">' + '<img src= ' + result[prop].newsImage + ' width="80%" height="80px">' +
          '<p id="tMembership">' + result[prop].title + '</p>' +
          '</div>' +
          '</div>' +
          '</a>' +
          '</div>';
      }
    }

    $$('.row').html(html);

    $$('.row .item-content').on('click', function() {
      var id = $$(this).prop('id');
      $$('.popup-membership .navbar .center').html(MEMBERSHIP[id].title);
      $$('.popup-membership .content-block img').attr('src', 'img/' + id + '.jpg');
      $$('.popup-membership .content-block table .descriptionMembership').html(MEMBERSHIP[id].description);
      $$('.popup-membership .content-block table .term').html(MEMBERSHIP[id].term);
      $$('.popup-membership .content-block table .outlet').html(MEMBERSHIP[id].outlet);
      app.popup('.popup-membership');
    });

    // $$('#btnJoin').on('click', function() {
    //     var id = $$(this).prop('id');
    //     $$('.popup-membership .navbar .center').html(MEMBERSHIP[id].title);
    //     $$('.popup-membership .content-block img').attr('src', 'img/' + id + '.jpg');
    //     $$('.popup-membership .content-block table .descriptionMembership').html(MEMBERSHIP[id].description);
    //     app.popup('.popup-membership');
    // });
  });

  // $$('#addWishlist').on('click', function() {
  // MEMBERSHIP
  // var n = localStorage.item;
  // var dtitle = DETAIL[n].title;
  // localStorage.wname = dtitle;
  //
  // var p = localStorage.item;
  // var dprice = DETAIL[p].price;
  // localStorage.wprice = dprice;
  //
  // var pl = localStorage.item;
  // var dplace = DETAIL[pl].place;
  // localStorage.wplace = dplace;
  // });
}

// var wishlist = [];
// localStorage["wishlist"] = JSON.stringify(carnames);
// var storedNames = JSON.parse(localStorage["wishlist"]);
//
// function collectionAction() {
//
//     $$('#abc').html(localStorage.wname);
//     $$('#qqq').html(localStorage.wprice);
//     $$('#gg').html(localStorage.wplace);
//
// }

function merchantAction() {

  var MERCHANT = {
    "s1": {
      "title": "BreadTalk",
      "newsImage": "img/s1.jpg",
      "location": "Lot 1.08, Level 1, Pavilion KL, Jalan Bukit Bintang ",
      "description": "BreadTalk has rapidly expanded to become an award-winning F&B Group that has established its mark on the world stage with its bakery, restaurant and food atrium footprints."
    },
    "s2": {
      "title": "ReloadMensWear",
      "newsImage": "img/s2.jpg",
      "location": "LG062-62A, Lower Ground Floor Mid Valley Megamall",
      "description": "This friendly family run business situated in the heart of Chatham town centre has been opened for the past 20 years supplying fashionable menswear. Over the last few years many new ranges of men’s clothing were introduced, and the results have been amazing, attracting many new customers. "
    },
    "s3": {
      "title": "Emporio",
      "newsImage": "img/s3.jpg",
      "location": "Lot 1.08, Level 1, Pavilion KL, Jalan Bukit Bintang",
      "description": "Discover the Emporio Armani men's and women's ready-to-wear and runway collections. Shop online today on the official Armani.com store."
    }
  };

  localforage.setItem('merchant', MERCHANT, function(result) {
    console.log(result);
  });

  localforage.getItem('merchant').then(function(result) {
    var html = '';
    for (var prop in result) {
      if (result.hasOwnProperty(prop)) {
        html += '<div class="card talks-card" id="' + prop + '">' +
          '<div class="card-header" style="padding-left: 0px; padding-right: 0px;">' +
          '<img src= ' + result[prop].newsImage + ' width="100%" height="150px">' +
          '</div>' +
          '<div class="card-content">' +
          '<div class="card-content-inner">' +
          '<p id="vtitle">' + result[prop].title +
          '</p>' +
          '<div class="item-comment">' +
          '<div class="item-title" id="vdescription">' + '</div>' + result[prop].description +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';
      }
    }
    $$('.talks-card').html(html);

    $$('.talks-card .card').on('click', function() {
      var id = $$(this).prop('id');
      $$('.popup-merchant-detail .navbar .center').html(MERCHANT[id].title);
      $$('.popup-merchant-detail .content-block img').attr('src', 'img/' + id + '.jpg');
      $$('.popup-merchant-detail .content-block table .descriptionM').html(MERCHANT[id].description);
      $$('.popup-merchant-detail .content-block table .location').html(MERCHANT[id].location);
      app.popup('.popup-merchant-detail');
    });
  });
}

function collectionAction() {

}

function moreAction() {

  $$('.user-profile .name').html(localStorage.username);

  // $$('.user-profile img').attr('src', localStorage.profilePicUrl);

  $$('.edit-profile-pic').on('click', function() {
    var clickedLink = this;
    app.popover('.popover-update-profile', clickedLink);
  });

  $$('#linkToLogout').on('click', function() {
    logout(true);
  });
}


function editProfileAction() {
  initDatePicker("#picker-date");

  $$('.edit-profile-pic').on('click', function() {
    var clickedLink = this;
    app.popover('.popover-update-profile', clickedLink);
  });

  $$('#btnReset').on('click', function() {
    $$('#profilePhoto').val('');
    $$('#eUsername').val('');
    $$('#eEmail').val('');
    $$('#picker-date').val('');
    $$('#eHp').val('');
    $$('#eAddress').val('');
  });
}

function changePasswordAction() {
  $$('#btnPassClear').on('click', function() {
    $$('#cPassword').val('');
    $$('#nPassword').val('');
    $$('#rPassword').val('');
  });
}

function contactUsAction() {
  $$('#feedbackClear').on('click', function() {
    $$('#cType').val('');
    $$('#cDescription').val('');
  });
}
