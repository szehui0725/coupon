gap.initialize();

if (navigator.platform === 'Win32' || navigator.platform === "Linux x86_64") {
    setTimeout(function() {
        $$('input[name="loginUsername"]').val('hui');
        $$('input[name="loginPassword"]').val('0177779932abc');
    }, 800);
    isLoggedIn();
}
