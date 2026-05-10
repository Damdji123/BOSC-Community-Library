<?php
// Database configuration for BOSC Community Library
define('DB_HOST', 'localhost');
define('DB_NAME', 'bosc_library');
define('DB_USER', 'root');
define('DB_PASS', '');

function getDbConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        header('Content-Type: application/json', true, 500);
        echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
}

// Start session for auth
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
