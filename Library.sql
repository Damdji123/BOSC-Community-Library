CREATE TABLE librarians (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
     CREATE TABLE members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      available INTEGER NOT NULL DEFAULT 1,
      borrower_id INTEGER,
      borrowed_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (borrower_id) REFERENCES members(id)
    );
    CREATE TABLE password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      librarian_id INTEGER NOT NULL,
      token TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (librarian_id) REFERENCES librarians(id)
    );