async function handleRegistration(event) {
  event.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  if (!name || !email || !password) {
    showNotification('Please complete every field.', 'error');
    return;
  }
  if (password !== confirmPassword) {
    showNotification('Passwords do not match.', 'error');
    return;
  }

  try {
    await registerLibrarian({ name, email, password });
    showNotification('Account created successfully! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'index.html', 1400);
  } catch (error) {
    // showNotification is already handled by apiFetch
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showNotification('Please enter your email and password.', 'error');
    return;
  }

  try {
    await loginLibrarian({ email, password });
    showNotification('Login successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'index.html', 1200);
  } catch (error) {
    // Handled by apiFetch
  }
}

async function handleForgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('forgot-email').value.trim();

  if (!email) {
    showNotification('Enter your registered email.', 'error');
    return;
  }

  try {
    const result = await requestPasswordReset({ email });
    showNotification(`Token sent! ${result.token}`, 'success');
  } catch (error) {
    // Handled by apiFetch
  }
}

async function handleResetPassword(event) {
  event.preventDefault();
  const token = document.getElementById('reset-token').value.trim();
  const password = document.getElementById('reset-password').value;
  const confirmPassword = document.getElementById('reset-confirm-password').value;

  if (!token || !password) {
    showNotification('Please enter both token and new password.', 'error');
    return;
  }
  if (password !== confirmPassword) {
    showNotification('Passwords do not match.', 'error');
    return;
  }

  try {
    await resetPassword({ token, password });
    showNotification('Password reset successful! Please log in.', 'success');
    setTimeout(() => window.location.href = 'login.html', 1400);
  } catch (error) {
    // Handled by apiFetch
  }
}
