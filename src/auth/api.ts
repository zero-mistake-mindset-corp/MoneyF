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