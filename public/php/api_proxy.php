<?php
// PHP connector example for BOSC Community Library.
// Run this file with a PHP-capable web server while the Node.js backend is running at http://localhost:3000.

$backendBase = 'http://localhost:3000/api';

function requestBackend($path, $method = 'GET', $payload = null) {
    global $backendBase;
    $url = rtrim($backendBase, '/') . '/' . ltrim($path, '/');

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($payload !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        }
    }

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        return json_encode(['success' => false, 'message' => 'PHP cURL error: ' . $error]);
    }

    return $response;
}

$action = isset($_GET['action']) ? $_GET['action'] : 'session';
$response = null;

switch ($action) {
    case 'login':
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        $payload = json_encode(['email' => $email, 'password' => $password]);
        $response = requestBackend('login', 'POST', $payload);
        break;
    case 'logout':
        $response = requestBackend('logout', 'POST');
        break;
    case 'register':
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        $payload = json_encode(['name' => $name, 'email' => $email, 'password' => $password]);
        $response = requestBackend('register', 'POST', $payload);
        break;
    case 'members':
        $response = requestBackend('members');
        break;
    case 'books':
        $response = requestBackend('books');
        break;
    default:
        $response = requestBackend('session');
        break;
}

header('Content-Type: application/json');
echo $response;
