<?php
// Database configuration for BOSC Community Library
define('DB_HOST', 'localhost');
define('DB_NAME', 'bosc_library');
define('DB_USER', 'root');
define('DB_PASS', '');

function getDbConnection() {
    try {
        // First try to connect to the server to check/create database
        $dsn_no_db = "mysql:host=" . DB_HOST . ";charset=utf8mb4";
        $pdo_init = new PDO($dsn_no_db, DB_USER, DB_PASS);
        $pdo_init->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
        
        // Now connect to the database
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        
        // Auto-setup tables if they don't exist
        setupTables($pdo);
        
        return $pdo;
    } catch (PDOException $e) {
        header('Content-Type: application/json', true, 500);
        echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
}

function setupTables($pdo) {
    $sql = "
    CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        available TINYINT(1) DEFAULT 1,
        image_path VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS loans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT,
        member_id INT,
        borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        return_date TIMESTAMP NULL,
        FOREIGN KEY (book_id) REFERENCES books(id),
        FOREIGN KEY (member_id) REFERENCES members(id)
    );
    ";
    $pdo->exec($sql);
}

// Start session for auth
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
