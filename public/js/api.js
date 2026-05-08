const apiBase = '/api';

async function apiFetch(path, options = {}) {
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

  const response = await fetch(`${apiBase}${path}`, config);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

async function getSession() {
  return apiFetch('/session', { method: 'GET' });
}

async function registerLibrarian(payload) {
  return apiFetch('/register', { method: 'POST', body: payload });
}

async function loginLibrarian(payload) {
  return apiFetch('/login', { method: 'POST', body: payload });
}

async function logoutLibrarian() {
  return apiFetch('/logout', { method: 'POST' });
}

async function requestPasswordReset(payload) {
  return apiFetch('/forgot-password', { method: 'POST', body: payload });
}

async function resetPassword(payload) {
  return apiFetch('/reset-password', { method: 'POST', body: payload });
}

async function fetchBooks() {
  return apiFetch('/books', { method: 'GET' });
}

async function createBook(payload) {
  return apiFetch('/books', { method: 'POST', body: payload });
}

async function borrowBook(payload) {
  return apiFetch('/books/borrow', { method: 'POST', body: payload });
}

async function returnBook(payload) {
  return apiFetch('/books/return', { method: 'POST', body: payload });
}

async function fetchMembers() {
  return apiFetch('/members', { method: 'GET' });
}

async function createMember(payload) {
  return apiFetch('/members', { method: 'POST', body: payload });
}

async function searchResources(type, query, options = {}) {
  const { limit = 10, offset = 0, sort = 'relevance' } = options;
  const params = new URLSearchParams({
    type,
    query,
    limit,
    offset,
    sort
  });
  return apiFetch(`/search?${params.toString()}`, { method: 'GET' });
}
