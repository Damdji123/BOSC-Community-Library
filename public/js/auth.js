async function handleRegistration(event) {
  event.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  if (!name || !email || !password) {
    showAuthMessage('Please complete every field.', 'error');
    return;
  }
  if (password !== confirmPassword) {
    showAuthMessage('Passwords do not match.', 'error');
    return;
  }

  try {
    await registerLibrarian({ name, email, password });
    showAuthMessage('Account created successfully. Redirecting to dashboard...', 'success');
    setTimeout(() => window.location.href = 'index.html', 1400);
  } catch (error) {
    showAuthMessage(error.message, 'error');
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showAuthMessage('Please enter your email and password.', 'error');
    return;
  }

  try {
    await loginLibrarian({ email, password });
    showAuthMessage('Login successful. Redirecting...', 'success');
    setTimeout(() => window.location.href = 'index.html', 1200);
  } catch (error) {
    showAuthMessage(error.message, 'error');
  }
}

async function handleForgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('forgot-email').value.trim();

  if (!email) {
    showAuthMessage('Enter your registered email.', 'error');
    return;
  }

  try {
    const result = await requestPasswordReset({ email });
    showAuthMessage(`${result.message} Token: ${result.token}`, 'success');
  } catch (error) {
    showAuthMessage(error.message, 'error');
  }
}

async function handleResetPassword(event) {
  event.preventDefault();
  const token = document.getElementById('reset-token').value.trim();
  const password = document.getElementById('reset-password').value;
  const confirmPassword = document.getElementById('reset-confirm-password').value;

  if (!token || !password) {
    showAuthMessage('Please enter both token and new password.', 'error');
    return;
  }
  if (password !== confirmPassword) {
    showAuthMessage('Passwords do not match.', 'error');
    return;
  }

  try {
    await resetPassword({ token, password });
    showAuthMessage('Your password was reset. Please log in.', 'success');
    setTimeout(() => window.location.href = 'login.html', 1400);
  } catch (error) {
    showAuthMessage(error.message, 'error');
  }
}

function showAuthMessage(message, type = 'info') {
  const messageBox = document.getElementById('auth-message');
  if (!messageBox) return;
  messageBox.textContent = message;
  messageBox.className = `auth-message ${type}`;
}
