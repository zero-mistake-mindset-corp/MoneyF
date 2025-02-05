function handleSignUpForm(event: Event) {
  event.preventDefault();
  const data = {
    username: (document.getElementById('usernameSignUp') as HTMLInputElement).value.trim(),
    email: (document.getElementById('emailSignUp') as HTMLInputElement).value.trim(),
    password: (document.getElementById('passwordSignUp') as HTMLInputElement).value.trim()
  };
  sendSignUpRequest('http://localhost:8080/useraccount/sign-up', data);
}

function handleEmailConfirmationForm(event: Event) {
  event.preventDefault();
  const emailCodeInput = document.getElementById('emailCodeInput') as HTMLInputElement;
  if (!currentEmailForConfirmation) {
    showAlert('error', 'No email stored for confirmation. Please register again.');
    return;
  }
  sendEmailConfirmation(
    'http://localhost:8080/useraccount/email/confirmation',
    currentEmailForConfirmation,
    emailCodeInput.value.trim()
  );
}

function handleResendCode() {
  if (!currentEmailForConfirmation) {
    showAlert('error', 'No email to resend code. Please register again.');
    return;
  }
  resendConfirmationCode(
    'http://localhost:8080/useraccount/email/confirmation/code',
    currentEmailForConfirmation
  );
  startResendTimer(60);
}

function handleSignInForm(event: Event) {
  event.preventDefault();
  const usernameInput = document.getElementById('usernameSignIn') as HTMLInputElement;
  const passwordInput = document.getElementById('passwordSignIn') as HTMLInputElement;

  const data = {
    emailOrUsername: usernameInput.value.trim(),
    password: passwordInput.value.trim()
  };

  sendSignInRequest('http://localhost:8080/auth/sign-in', data);
}

function handleTwoFactorForm(event: Event) {
  event.preventDefault();
  const twoFactorCodeInput = document.getElementById('twoFactorCodeInput') as HTMLInputElement;
  if (!twoFactorCodeInput) return;

  sendTwoFactorAuthRequest(twoFactorCodeInput.value.trim());
}