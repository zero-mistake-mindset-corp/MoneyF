"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function sendSignUpRequest(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (response.status === 204) {
                showAlert('success', 'You have been successfully registered! Check your email for the code.');
                currentEmailForConfirmation = data.email;
                showEmailConfirmationBlock();
                return;
            }
            if (response.status === 409) {
                showAlert('error', 'A user with this name or email already exists.');
                return;
            }
            if (response.status === 400) {
                showAlert('error', `Invalid password or email`);
                return;
            }
            if (!response.ok) {
                const errorText = yield response.text();
                throw new Error(errorText || `Error during registration, code: ${response.status}`);
            }
            showAlert('success', 'Registration successful (not 204, but OK).');
        }
        catch (error) {
            console.error('Register error:', error.message);
            showAlert('error', `Error: ${error.message}`);
        }
    });
}
function sendEmailConfirmation(url, email, code) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = { email, code };
            const response = yield fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (response.status === 400) {
                showAlert('error', `Invalid confirmation code`);
                return;
            }
            if (!response.ok) {
                const errorText = yield response.text();
                throw new Error(errorText || `Error confirming email, code: ${response.status}`);
            }
            showAlert('success', 'Email confirmed successfully!');
            const emailConfirmationContainer = document.getElementById('emailConfirmationContainer');
            if (emailConfirmationContainer) {
                emailConfirmationContainer.style.display = 'none';
            }
        }
        catch (error) {
            console.error('Email confirmation error:', error.message);
            showAlert('error', `Error: ${error.message}`);
        }
    });
}
function resendConfirmationCode(baseUrl, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resendUrl = `${baseUrl}?email=${encodeURIComponent(email)}`;
            const response = yield fetch(resendUrl, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error(`Failed to resend code: ${response.statusText}`);
            }
            showAlert('success', 'Code has been resent to your email!');
        }
        catch (error) {
            console.error('Resend code error:', error.message);
            showAlert('error', `Error: ${error.message}`);
        }
    });
}
function sendTwoFactorAuthRequest(code) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentUserFor2FA) {
            showAlert('error', 'No login data found. Please try logging in again.');
            return;
        }
        try {
            const payload = {
                emailOrUsername: currentUserFor2FA.emailOrUsername,
                password: currentUserFor2FA.password,
                code
            };
            const response = yield fetch('http://localhost:8080/auth/sign-in/2fa', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorText = yield response.text();
                throw new Error(errorText || `Error confirming 2FA code, code: ${response.status}`);
            }
            const responseData = yield response.json();
            console.log('2FA Success:', responseData);
            localStorage.setItem('accessToken', responseData.accessToken);
            localStorage.setItem('refreshToken', responseData.refreshToken);
            localStorage.setItem('accessTokenExpiration', responseData.accessTokenExpiration);
            localStorage.setItem('refreshTokenExpiration', responseData.refreshTokenExpiration);
            window.location.href = './dashboard.html';
        }
        catch (error) {
            console.error('2FA error:', error.message);
            showAlert('error', `Error: ${error.message}`);
        }
    });
}
function sendSignInRequest(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.status === 400 || response.status === 404) {
                showAlert('error', 'Invalid password or username.');
                return;
            }
            if (response.status === 202) {
                showAlert('success', 'Two-Factor Authentication is enabled. Check your email for the code.');
                currentUserFor2FA = data;
                showTwoFactorAuthBlock();
                return;
            }
            if (!response.ok) {
                const errorText = yield response.text();
                throw new Error(errorText || 'Error when logging in');
            }
            const responseData = yield response.json();
            console.log('Successful entry:', responseData);
            localStorage.setItem('accessToken', responseData.accessToken);
            localStorage.setItem('refreshToken', responseData.refreshToken);
            localStorage.setItem('accessTokenExpiration', responseData.accessTokenExpiration);
            localStorage.setItem('refreshTokenExpiration', responseData.refreshTokenExpiration);
            window.location.href = './dashboard.html';
        }
        catch (error) {
            console.error('Login error:', error.message);
            showAlert('error', `Error: ${error.message}`);
        }
    });
}
