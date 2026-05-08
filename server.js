const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'bosc-library-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Authentication required.' });
  }
}

app.get('/api/session', (req, res) => {
  if (req.session && req.session.userId) {
    db.get('SELECT id, name, email FROM librarians WHERE id = ?', [req.session.userId], (err, user) => {
      if (err) return res.status(500).json({ success: false, message: 'Unable to read session.' });
      res.json({ authenticated: Boolean(user), librarian: user || null });
    });
  } else {
    res.json({ authenticated: false, librarian: null });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required. Password must be at least 6 characters.' });
  }

  db.get('SELECT id FROM librarians WHERE email = ?', [email.trim().toLowerCase()], async (err, existing) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();

    db.run('INSERT INTO librarians (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)', [name.trim(), email.trim().toLowerCase(), passwordHash, createdAt], function (insertErr) {
      if (insertErr) return res.status(500).json({ success: false, message: 'Unable to create account.' });
      req.session.userId = this.lastID;
      res.json({ success: true, message: 'Registration successful.', librarian: { id: this.lastID, name: name.trim(), email: email.trim().toLowerCase() } });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  db.get('SELECT id, name, email, password_hash FROM librarians WHERE email = ?', [email.trim().toLowerCase()], async (err, user) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    req.session.userId = user.id;
    res.json({ success: true, message: 'Login successful.', librarian: { id: user.id, name: user.name, email: user.email } });
  });
});

app.post('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.json({ success: true, message: 'Logged out successfully.' });
    });
  } else {
    res.json({ success: true, message: 'Logged out successfully.' });
  }
});

app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

  db.get('SELECT id FROM librarians WHERE email = ?', [email.trim().toLowerCase()], (err, user) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    if (!user) return res.status(404).json({ success: false, message: 'No librarian found with that email.' });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    db.run('INSERT INTO password_resets (librarian_id, token, expires_at) VALUES (?, ?, ?)', [user.id, token, expiresAt], (insertErr) => {
      if (insertErr) return res.status(500).json({ success: false, message: 'Unable to create reset request.' });
      res.json({ success: true, message: 'Password reset request created. Use the reset token on the reset page.', token });
    });
  });
});

app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Token and password are required. Password must be at least 6 characters.' });
  }

  db.get('SELECT librarian_id, expires_at FROM password_resets WHERE token = ?', [token], async (err, record) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error.' });
    if (!record) return res.status(404).json({ success: false, message: 'Invalid reset token.' });
    if (new Date(record.expires_at) < new Date()) return res.status(400).json({ success: false, message: 'Reset token has expired.' });

    const passwordHash = await bcrypt.hash(password, 10);
    db.run('UPDATE librarians SET password_hash = ? WHERE id = ?', [passwordHash, record.librarian_id], (updateErr) => {
      if (updateErr) return res.status(500).json({ success: false, message: 'Unable to reset password.' });
      db.run('DELETE FROM password_resets WHERE token = ?', [token]);
      res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
    });
  });
});

app.get('/api/books', (req, res) => {
  db.all(`SELECT books.id, books.title, books.author, books.available, books.borrower_id, books.borrowed_at, members.name AS borrower_name FROM books LEFT JOIN members ON books.borrower_id = members.id`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Unable to load books.' });
    res.json({ success: true, books: rows });
  });
});

app.post('/api/books', requireAuth, (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ success: false, message: 'Title and author are required.' });

  const createdAt = new Date().toISOString();
  db.run('INSERT INTO books (title, author, created_at) VALUES (?, ?, ?)', [title.trim(), author.trim(), createdAt], function (err) {
    if (err) return res.status(500).json({ success: false, message: 'Unable to add book.' });
    res.json({ success: true, message: 'Book added.', book: { id: this.lastID, title: title.trim(), author: author.trim(), available: 1 } });
  });
});

app.post('/api/books/borrow', requireAuth, (req, res) => {
  const { bookId, memberId } = req.body;
  if (!bookId || !memberId) return res.status(400).json({ success: false, message: 'Book ID and member ID are required.' });

  db.get('SELECT available FROM books WHERE id = ?', [bookId], (err, book) => {
    if (err) return res.status(500).json({ success: false, message: 'Unable to query book.' });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    if (!book.available) return res.status(400).json({ success: false, message: 'Book is already borrowed.' });

    const borrowedAt = new Date().toISOString();
    db.run('UPDATE books SET available = 0, borrower_id = ?, borrowed_at = ? WHERE id = ?', [memberId, borrowedAt, bookId], function (updateErr) {
      if (updateErr) return res.status(500).json({ success: false, message: 'Unable to borrow book.' });
      res.json({ success: true, message: 'Book borrowed successfully.' });
    });
  });
});

app.post('/api/books/return', requireAuth, (req, res) => {
  const { bookId } = req.body;
  if (!bookId) return res.status(400).json({ success: false, message: 'Book ID is required.' });

  db.get('SELECT available FROM books WHERE id = ?', [bookId], (err, book) => {
    if (err) return res.status(500).json({ success: false, message: 'Unable to query book.' });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    if (book.available) return res.status(400).json({ success: false, message: 'Book is not currently borrowed.' });

    db.run('UPDATE books SET available = 1, borrower_id = NULL, borrowed_at = NULL WHERE id = ?', [bookId], function (updateErr) {
      if (updateErr) return res.status(500).json({ success: false, message: 'Unable to return book.' });
      res.json({ success: true, message: 'Book returned successfully.' });
    });
  });
});

app.get('/api/members', (req, res) => {
  db.all('SELECT id, name, email, created_at FROM members', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Unable to load members.' });
    res.json({ success: true, members: rows });
  });
});

app.post('/api/members', requireAuth, (req, res) => {
  const { name, email } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Member name is required.' });

  const createdAt = new Date().toISOString();
  db.run('INSERT INTO members (name, email, created_at) VALUES (?, ?, ?)', [name.trim(), email ? email.trim() : null, createdAt], function (err) {
    if (err) return res.status(500).json({ success: false, message: 'Unable to add member.' });
    res.json({ success: true, message: 'Member added.', member: { id: this.lastID, name: name.trim(), email: email ? email.trim() : '' } });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`BOSC Community Library server is running at http://localhost:${port}`);
});
