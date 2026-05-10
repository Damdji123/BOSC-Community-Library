<?php
require_once 'config.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$db = getDbConnection();

// Simple response helper
function sendResponse($success, $data = null, $message = '') {
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ]);
    exit;
}

// Get JSON body for POST requests
$jsonBody = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'session':
        if (isset($_SESSION['user'])) {
            sendResponse(true, $_SESSION['user']);
        } else {
            sendResponse(false, null, 'Not logged in');
        }
        break;

    case 'login':
        $email = $jsonBody['email'] ?? '';
        $password = $jsonBody['password'] ?? '';
        
        $stmt = $db->prepare("SELECT * FROM members WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && ($user['password_hash'] === null || password_verify($password, $user['password_hash']))) {
            $_SESSION['user'] = [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ];
            sendResponse(true, $_SESSION['user'], 'Login successful');
        } else {
            sendResponse(false, null, 'Invalid credentials');
        }
        break;

    case 'logout':
        session_destroy();
        sendResponse(true, null, 'Logged out');
        break;

    case 'books':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $stmt = $db->query("SELECT * FROM books ORDER BY created_at DESC");
            $books = $stmt->fetchAll();
            sendResponse(true, $books);
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $title = $jsonBody['title'] ?? '';
            $author = $jsonBody['author'] ?? '';
            $stmt = $db->prepare("INSERT INTO books (title, author) VALUES (?, ?)");
            $stmt->execute([$title, $author]);
            sendResponse(true, ['id' => $db->lastInsertId()], 'Book added');
        }
        break;

    case 'borrow':
        $bookId = $jsonBody['book_id'] ?? 0;
        $memberId = $jsonBody['member_id'] ?? 0;
        
        $db->beginTransaction();
        try {
            // Check availability
            $stmt = $db->prepare("SELECT available FROM books WHERE id = ? FOR UPDATE");
            $stmt->execute([$bookId]);
            $book = $stmt->fetch();
            
            if ($book && $book['available']) {
                // Create loan
                $stmt = $db->prepare("INSERT INTO loans (book_id, member_id) VALUES (?, ?)");
                $stmt->execute([$bookId, $memberId]);
                
                // Update book status
                $stmt = $db->prepare("UPDATE books SET available = 0 WHERE id = ?");
                $stmt->execute([$bookId]);
                
                $db->commit();
                sendResponse(true, null, 'Book borrowed successfully');
            } else {
                $db->rollBack();
                sendResponse(false, null, 'Book not available');
            }
        } catch (Exception $e) {
            $db->rollBack();
            sendResponse(false, null, 'Error: ' . $e->getMessage());
        }
        break;

    case 'return':
        $bookId = $jsonBody['book_id'] ?? 0;
        
        $db->beginTransaction();
        try {
            // Update loan
            $stmt = $db->prepare("UPDATE loans SET return_date = NOW() WHERE book_id = ? AND return_date IS NULL");
            $stmt->execute([$bookId]);
            
            // Update book status
            $stmt = $db->prepare("UPDATE books SET available = 1 WHERE id = ?");
            $stmt->execute([$bookId]);
            
            $db->commit();
            sendResponse(true, null, 'Book returned successfully');
        } catch (Exception $e) {
            $db->rollBack();
            sendResponse(false, null, 'Error: ' . $e->getMessage());
        }
        break;

    case 'members':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $stmt = $db->query("SELECT * FROM members ORDER BY created_at DESC");
            $members = $stmt->fetchAll();
            sendResponse(true, $members);
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name = $jsonBody['name'] ?? '';
            $email = $jsonBody['email'] ?? '';
            $password = $jsonBody['password'] ?? null;
            $hash = $password ? password_hash($password, PASSWORD_DEFAULT) : null;
            
            $stmt = $db->prepare("INSERT INTO members (name, email, password_hash) VALUES (?, ?, ?)");
            $stmt->execute([$name, $email, $hash]);
            sendResponse(true, ['id' => $db->lastInsertId()], 'Member added');
        }
        break;

    default:
        sendResponse(false, null, 'Invalid action');
        break;
}
