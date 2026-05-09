-- Table des membres avec accès possible
CREATE TABLE members (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE, -- Obligatoire pour l'identification
  password_hash TEXT,         -- Optionnel si vous gérez les accès
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des livres (sans infos d'emprunt direct)
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  available INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- NOUVELLE TABLE : Pour l'historique et les emprunts actifs
CREATE TABLE loans (
  id INTEGER PRIMARY KEY,
  book_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  loan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  return_date DATETIME, -- Vide si le livre n'est pas encore rendu
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
);
