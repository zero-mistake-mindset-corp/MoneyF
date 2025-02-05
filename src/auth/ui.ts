function showEmailConfirmationBlock() {
    const signUpContainer = document.getElementById('signUpContainer');
    if (signUpContainer) signUpContainer.style.display = 'none';
    const emailConfirmationContainer = document.getElementById('emailConfirmationContainer');
    if (emailConfirmationContainer) emailConfirmationContainer.style.display = 'block';
    startResendTimer(60);
  }
  
  function startResendTimer(seconds: number) {
    const resendBtn = document.getElementById('resendCodeBtn') as HTMLButtonElement | null;
    const resendText = document.getElementById('resendTimerText');
    if (!resendBtn || !resendText) return;
    let timeLeft = seconds;
    resendBtn.disabled = true;
    resendText.textContent = `Resend code in ${timeLeft}s`;
    const intervalId = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        resendText.textContent = `Resend code in ${timeLeft}s`;
      } else {
        clearInterval(intervalId);
        resendBtn.disabled = false;
        resendText.textContent = '';
      }
    }, 1000);
  }
  
  function showTwoFactorAuthBlock() {
    const signInContainer = document.getElementById('signInForm')?.parentElement;
    if (signInContainer) signInContainer.style.display = 'none';
    const twoFactorContainer = document.getElementById('twoFactorAuthContainer');
    if (twoFactorContainer) twoFactorContainer.style.display = 'block';
  }
  