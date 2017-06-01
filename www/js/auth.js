function isLoggedIn() {
    if (localStorage.login === "true") {
        app.closeModal();
        $$('.statusbar-overlay').show();
        //loadPage('userHome.html?toolbar=true');
        var data = {
            url: 'userHome.html',
            query: {
                toolbar: 'true'
            }
        }
        mainView.router.load(data);
    } else {
    $$('.statusbar-overlay').hide();
        app.loginScreen();
    }
}

$$('#btnToLoginPage').on('click', function(){
restart();
});

$$('.button#btnToLogin').on('click', function() {
    login();
});

$$('input[name="loginPassword"]').on('click', function() {
    $$(this).val('');
});

$$('input[name="loginUsername"]').on('keyup', function(e) {
    if (e.keyCode === 13) {
        $$('input[id="loginPassword"]').focus();
    }
});

$$('input[name="loginPassword"]').on('keyup', function(e) {
    if (e.keyCode === 13) {
        login();
    }
});

$$('#viewLoginPw').on('touchstart', function() {
    $$('input[id="loginPassword"]').attr('type', 'text');
});

$$('#viewLoginPw').on('touchend', function() {
    $$('input[id="loginPassword"]').attr('type', 'password');
});


function login() {
    var username = $$('input[name="loginUsername"]').val();
    var password = $$('input[name="loginPassword"]').val();

    if (isEmpty(username)) {
        alertMsg(-1, "invalid_username");
    } else if (isEmpty(password) || password.length < 8) {
        alertMsg(-1, "invalid_password");
    } else {
        var loginObj = {
            username: username,
            password: password
        };

        /*request('POST', 'login.php', loginObj, function(res) {
            if (res.status === 'success') {*/
                localStorage.login = "true";
                localStorage.username = username;
                // localStorage.nickName = username;
                // localStorage.profilePicUrl = "img/profile.jpg";
                /*localStorage.username = loginObj.username;
                localStorage.first_name = res.data.first_name;
                localStorage.member_status = res.data.member_status;
                localStorage.member_type = res.data.member_type;
                localStorage.authkey = res.data.authkey;*/
                isLoggedIn();
            /*} else {
                app.alert(res.message, function() {
                    $$('input[id="loginPassword"]').val('').focus();
                });
            }
        });*/
    }
}

$$('#btnToRegister').on('click', function() {
  initDatePicker('#regDob');
app.popup('.popup-register');
});

$$('#btnToForgetPw').on('click', function() {
    app.prompt('Please enter your E-mail.', 'Coupon',
        function(email) {
            if (!isEmail(email)) {
                app.alert("Invalid email");
            } else {
                request('POST', 'forgot', {
                    email: email
                }, function(res) {
                    if (res.status === 'success') {
                        app.alert('New password will be sent to your email.');
                    } else {
                        handleError(res);
                    }
                });
            }
        });
});

$$('.popup-register #btnRegCancel').on('click', function() {
    restart();
});

$$('.popup-register #btnRegSubmit').on('click', function() {
    var email = $$('input#regEmail').val();
    var name = $$('input#regUsername').val();
    var password = $$('input#regPassword').val();
    var cpassword = $$('input#regCPassword').val();
    var dob = $$('input#regDob').val();

    if (isEmpty(email)) {
        alertMsg(-1, "Invalid email");
    } else if (isEmpty(name)) {
        alertMsg(-1, "Invalid username")
    } else if (isEmpty(password) || password.length < 6) {
        alertMsg(-1, "Invalid password");
    } else if (isEmpty(cpassword) || password.length < 6) {
        alertMsg(-1, "Invalid confirm password");
    } else if (isEmpty(dob)) {
        alertMsg(-1, "Invalid date of birth");
    };

    // } else {
    //     var regObj = {
    //         "fullname": fullname,
    //         "username": username,
    //         "password": password,
    //         "gender": gender,
    //         "dob": dob,
    //         "hp": hp
    //     };
    // request('POST', 'register', regObj, function(res) {
    //     if (res.status === 'success') {
    //         alertMsg(0, 'register_success');
    //     } else {
    //         handleError(res);
    //     }
    // });


    // app.closeModal('.popup-register');
    // app.closeModal('.login-screen');
    // loadPage('userHome.html');
});

$$('.fa-eye#viewPw').on('touchstart', function() {
    $$('input[id="regPassword"]').attr('type', 'text');
});

$$('.fa-eye#viewPw').on('touchend', function() {
    $$('input[id="regPassword"]').attr('type', 'password');
});

$$('.fa-eye#viewCPw').on('touchstart', function() {
    $$('input[id="regCPassword"]').attr('type', 'text');
});

$$('.fa-eye#viewCPw').on('touchend', function() {
    $$('input[id="regCPassword"]').attr('type', 'password');
});

function logout(res) {
  // delete localStorage.["item_key"];
localStorage.clear();
    localStorage.removeItem('login');
    if (res === true) {
        restart();
    }
}

$$('#btnFbLogin').on('click', function() {
    fbLogin();
});

function fbLogin(){
  facebookConnectPlugin.login(['email'], function(response){
    isLoggedIn();
    // alert('Login');
    // alert(JSON.stringify(response.authResponse));
  }, function(error){
    alert('error');
  })
}

$$('#btnFbLogout').on('click', function() {
    fbLogout();
});

function fbLogout(){
  facebookConnectPlugin.logout((response) => {
    alert(JSON.stringify(response));
  })
}

// var fbLoginSuccess = function (userData) {
//   console.log("UserInfo: ", userData);
// }
