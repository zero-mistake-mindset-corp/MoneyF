function showAlert(type: "success" | "error", message: string) {
  const alertContainer = document.getElementById('alertContainer');
  if (!alertContainer) return;

  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert');

  if (type === 'success') {
    alertDiv.classList.add('alert-success');
  } else {
    alertDiv.classList.add('alert-error');
  }

  alertDiv.textContent = message;
  alertContainer.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

let currentEmailForConfirmation: string | null = null;

async function sendSignUpRequest(url: string, data: { username: string; email: string; password: string }) {
  try {
    const response = await fetch(url, {
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
      const errorText = await response.text();
      throw new Error(errorText || `Error during registration, code: ${response.status}`);
    }

    showAlert('success', 'Registration successful (not 204, but OK).');
  } catch (error: any) {
    console.error('Register error:', error.message);
    showAlert('error', `Error: ${error.message}`);
  }
}

function showEmailConfirmationBlock() {
  const signUpContainer = document.getElementById('signUpContainer');
  if (signUpContainer) {
    signUpContainer.style.display = 'none';
  }

  const emailConfirmationContainer = document.getElementById('emailConfirmationContainer');
  if (emailConfirmationContainer) {
    emailConfirmationContainer.style.display = 'block';
  }

  startResendTimer(60);
}

async function sendEmailConfirmation(url: string, email: string, code: string) {
  try {
    const payload = { email, code };
    const response = await fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.status === 400)
    {
      showAlert('error', `Invalid confirmation code`);
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error confirming email, code: ${response.status}`);
    }

    showAlert('success', 'Email confirmed successfully!');
    const emailConfirmationContainer = document.getElementById('emailConfirmationContainer');
    if (emailConfirmationContainer) {
      emailConfirmationContainer.style.display = 'none';
    }
  } catch (error: any) {
    console.error('Email confirmation error:', error.message);
    showAlert('error', `Error: ${error.message}`);
  }
}

async function resendConfirmationCode(baseUrl: string, email: string) {
  try {
    const resendUrl = `${baseUrl}?email=${encodeURIComponent(email)}`;
    const response = await fetch(resendUrl, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`Failed to resend code: ${response.statusText}`);
    }
    showAlert('success', 'Code has been resent to your email!');
  } catch (error: any) {
    console.error('Resend code error:', error.message);
    showAlert('error', `Error: ${error.message}`);
  }
}

function startResendTimer(seconds: number) {
  const resendBtn = document.getElementById('resendCodeBtn') as HTMLButtonElement | null;
  const resendText = document.getElementById('resendTimerText');

  if (!resendBtn || !resendText) return;

  let timeLeft = seconds;
  resendBtn.disabled = true;
  resendText.textContent = `You can resend code in ${timeLeft}s`;

  const intervalId = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      resendText.textContent = `You can resend code in ${timeLeft}s`;
    } else {
      clearInterval(intervalId);
      resendBtn.disabled = false;
      resendText.textContent = '';
    }
  }, 1000);
}

let currentUserFor2FA: { emailOrUsername: string, password: string } | null = null;

function showTwoFactorAuthBlock() {
    const signInContainer = document.getElementById('signInForm')?.parentElement;
    if (signInContainer) {
        signInContainer.style.display = 'none';
    }

    const twoFactorContainer = document.getElementById('twoFactorAuthContainer');
    if (twoFactorContainer) {
        twoFactorContainer.style.display = 'block';
    }
}

async function sendTwoFactorAuthRequest(code: string) {
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

        const response = await fetch('http://localhost:8080/auth/sign-in/2fa', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error confirming 2FA code, code: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('2FA Success:', responseData);

        localStorage.setItem('accessToken', responseData.accessToken);
        localStorage.setItem('refreshToken', responseData.refreshToken);
        localStorage.setItem('accessTokenExpiration', responseData.accessTokenExpiration);
        localStorage.setItem('refreshTokenExpiration', responseData.refreshTokenExpiration);

        window.location.href = './dashboard.html';
    } catch (error: any) {
        console.error('2FA error:', error.message);
        showAlert('error', `Error: ${error.message}`);
    }
}

async function sendSignInRequest(url: string, data: { emailOrUsername: string; password: string }) {
  try {
      const response = await fetch(url, {
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
          const errorText = await response.text();
          throw new Error(errorText || 'Error when logging in');
      }

      const responseData = await response.json();
      console.log('Successful entry:', responseData);

      localStorage.setItem('accessToken', responseData.accessToken);
      localStorage.setItem('refreshToken', responseData.refreshToken);
      localStorage.setItem('accessTokenExpiration', responseData.accessTokenExpiration);
      localStorage.setItem('refreshTokenExpiration', responseData.refreshTokenExpiration);

      window.location.href = './dashboard.html';
  } catch (error: any) {
      console.error('Login error:', error.message);
      showAlert('error', `Error: ${error.message}`);
  }
}

function handleTwoFactorForm(event: Event) {
  event.preventDefault();
  const twoFactorCodeInput = document.getElementById('twoFactorCodeInput') as HTMLInputElement;
  if (!twoFactorCodeInput) return;

  sendTwoFactorAuthRequest(twoFactorCodeInput.value.trim());
}


function handleSignUpForm(event: Event) {
  event.preventDefault();
  const usernameInput = document.getElementById('usernameSignUp') as HTMLInputElement;
  const emailInput = document.getElementById('emailSignUp') as HTMLInputElement;
  const passwordInput = document.getElementById('passwordSignUp') as HTMLInputElement;

  const data = {
    username: usernameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value.trim()
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

window.addEventListener('DOMContentLoaded', () => {
  const signUpForm = document.getElementById('signUpForm');
  if (signUpForm) {
    signUpForm.addEventListener('submit', handleSignUpForm);
  }

  const confirmEmailForm = document.getElementById('confirmEmailForm');
  if (confirmEmailForm) {
    confirmEmailForm.addEventListener('submit', handleEmailConfirmationForm);
  }

  const resendCodeBtn = document.getElementById('resendCodeBtn');
  if (resendCodeBtn) {
    resendCodeBtn.addEventListener('click', handleResendCode);
  }

  const signInForm = document.getElementById('signInForm');
  if (signInForm) {
    signInForm.addEventListener('submit', handleSignInForm);
  }

  const twoFactorForm = document.getElementById('twoFactorForm');
  if (twoFactorForm) {
    twoFactorForm.addEventListener('submit', handleTwoFactorForm);
  }
});
