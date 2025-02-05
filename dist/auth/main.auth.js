"use strict";
let currentEmailForConfirmation = null;
let currentUserFor2FA = null;
window.addEventListener('DOMContentLoaded', () => {
    var _a, _b, _c, _d, _e;
    (_a = document.getElementById('signUpForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', handleSignUpForm);
    (_b = document.getElementById('confirmEmailForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', handleEmailConfirmationForm);
    (_c = document.getElementById('resendCodeBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', handleResendCode);
    (_d = document.getElementById('signInForm')) === null || _d === void 0 ? void 0 : _d.addEventListener('submit', handleSignInForm);
    (_e = document.getElementById('twoFactorForm')) === null || _e === void 0 ? void 0 : _e.addEventListener('submit', handleTwoFactorForm);
});
