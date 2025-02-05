"use strict";
function handleSignUpForm(event) {
    event.preventDefault();
    const data = {
        username: document.getElementById('usernameSignUp').value.trim(),
        email: document.getElementById('emailSignUp').value.trim(),
        password: document.getElementById('passwordSignUp').value.trim()
    };
    sendSignUpRequest('http://localhost:8080/useraccount/sign-up', data);
}
function handleEmailConfirmationForm(event) {
    event.preventDefault();
    const emailCodeInput = document.getElementById('emailCodeInput');
    if (!currentEmailForConfirmation) {
        showAlert('error', 'No email stored for confirmation. Please register again.');
        return;
    }
    sendEmailConfirmation('http://localhost:8080/useraccount/email/confirmation', currentEmailForConfirmation, emailCodeInput.value.trim());
}
function handleResendCode() {
    if (!currentEmailForConfirmation) {
        showAlert('error', 'No email to resend code. Please register again.');
        return;
    }
    resendConfirmationCode('http://localhost:8080/useraccount/email/confirmation/code', currentEmailForConfirmation);
    startResendTimer(60);
}
function handleSignInForm(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('usernameSignIn');
    const passwordInput = document.getElementById('passwordSignIn');
    const data = {
        emailOrUsername: usernameInput.value.trim(),
        password: passwordInput.value.trim()
    };
    sendSignInRequest('http://localhost:8080/auth/sign-in', data);
}
function handleTwoFactorForm(event) {
    event.preventDefault();
    const twoFactorCodeInput = document.getElementById('twoFactorCodeInput');
    if (!twoFactorCodeInput)
        return;
    sendTwoFactorAuthRequest(twoFactorCodeInput.value.trim());
}
