let currentEmailForConfirmation: string | null = null;
let currentUserFor2FA: { emailOrUsername: string, password: string } | null = null;

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('signUpForm')?.addEventListener('submit', handleSignUpForm);
  document.getElementById('confirmEmailForm')?.addEventListener('submit', handleEmailConfirmationForm);
  document.getElementById('resendCodeBtn')?.addEventListener('click', handleResendCode);
  document.getElementById('signInForm')?.addEventListener('submit', handleSignInForm);
  document.getElementById('twoFactorForm')?.addEventListener('submit', handleTwoFactorForm);
});
