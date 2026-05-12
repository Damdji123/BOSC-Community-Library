const apiBase = 'php/api.php?action=';

async function apiFetch(action, options = {}) {
  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${apiBase}${action}`, config);
    const data = await response.json();
    
    if (!response.ok || data.success === false) {
      const errorMsg = data.message || 'Request failed';
      if (typeof showNotification === 'function') showNotification(errorMsg, 'error');
      throw new Error(errorMsg);
    }
    
    // Optional success notification
    if (data.message && options.notifySuccess && typeof showNotification === 'function') {
      showNotification(data.message, 'success');
    }
    
    return data;
  } catch (err) {
    if (typeof showNotification === 'function' && !err.message.includes('apiFetch')) {
       // Only show if not already handled
    }
    throw err;
  }
}

async function getSession() {
  return apiFetch('session', { method: 'GET' });
}

async function registerLibrarian(payload) {
  return apiFetch('register', { method: 'POST', body: payload });
}

async function loginLibrarian(payload) {
  return apiFetch('login', { method: 'POST', body: payload });
}

async function logoutLibrarian() {
  return apiFetch('logout', { method: 'POST' });
}

async function requestPasswordReset(payload) {
  return apiFetch('forgot-password', { method: 'POST', body: payload });
}

async function resetPassword(payload) {
  return apiFetch('reset-password', { method: 'POST', body: payload });
}

async function fetchBooks() {
  return apiFetch('books', { method: 'GET' });
}

async function createBook(payload) {
  return apiFetch('books', { method: 'POST', body: payload });
}

async function borrowBook(payload) {
  return apiFetch('borrow', { method: 'POST', body: payload });
}

async function returnBook(payload) {
  return apiFetch('return', { method: 'POST', body: payload });
}

async function fetchMembers() {
  return apiFetch('members', { method: 'GET' });
}

async function createMember(payload) {
  return apiFetch('members', { method: 'POST', body: payload });
}
