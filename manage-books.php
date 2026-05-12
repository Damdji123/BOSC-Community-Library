<?php
require_once 'php/header.php';

// Check if logged in
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}

$db = getDbConnection();

// Handle Add Book
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_book'])) {
    $title = trim($_POST['title'] ?? '');
    $author = trim($_POST['author'] ?? '');
    if (!empty($title) && !empty($author)) {
        $stmt = $db->prepare("INSERT INTO books (title, author) VALUES (?, ?)");
        $stmt->execute([$title, $author]);
        $_SESSION['message'] = "Book added successfully!";
        $_SESSION['message_type'] = "success";
    }
}

// Handle Borrow/Return
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['loan_action'])) {
    $bookId = $_POST['book_id'] ?? 0;
    $memberId = $_POST['member_id'] ?? 0;
    $action = $_POST['loan_action'];

    if ($action === 'borrow' && $bookId && $memberId) {
        $db->beginTransaction();
        $stmt = $db->prepare("SELECT available FROM books WHERE id = ? FOR UPDATE");
        $stmt->execute([$bookId]);
        $book = $stmt->fetch();
        if ($book && $book['available']) {
            $db->prepare("INSERT INTO loans (book_id, member_id) VALUES (?, ?)")->execute([$bookId, $memberId]);
            $db->prepare("UPDATE books SET available = 0 WHERE id = ?")->execute([$bookId]);
            $db->commit();
            $_SESSION['message'] = "Book borrowed successfully!";
            $_SESSION['message_type'] = "success";
        } else {
            $db->rollBack();
            $_SESSION['message'] = "Book not available.";
            $_SESSION['message_type'] = "error";
        }
    } elseif ($action === 'return' && $bookId) {
        $db->beginTransaction();
        $db->prepare("UPDATE loans SET return_date = NOW() WHERE book_id = ? AND return_date IS NULL")->execute([$bookId]);
        $db->prepare("UPDATE books SET available = 1 WHERE id = ?")->execute([$bookId]);
        $db->commit();
        $_SESSION['message'] = "Book returned successfully!";
        $_SESSION['message_type'] = "success";
    }
}

// Fetch data for selects
$members = $db->query("SELECT * FROM members ORDER BY name")->fetchAll();
$books = $db->query("SELECT * FROM books ORDER BY title")->fetchAll();
?>

<main>
    <section class="page-header">
        <div class="container">
            <h2>Manage Books</h2>
            <p>Add new titles or manage library loans</p>
        </div>
    </section>

    <section class="management-section">
        <div class="container">
            <div class="management-grid">
                <!-- Add Book -->
                <div class="management-card">
                    <h3>Add New Book</h3>
                    <form method="POST">
                        <input type="hidden" name="add_book" value="1">
                        <div class="form-group">
                            <label for="title">Book Title</label>
                            <input type="text" name="title" placeholder="Enter book title" required>
                        </div>
                        <div class="form-group">
                            <label for="author">Author</label>
                            <input type="text" name="author" placeholder="Enter author name" required>
                        </div>
                        <button type="submit" class="btn-primary"><i data-lucide="plus-circle"></i> Add Book</button>
                    </form>
                </div>

                <!-- Borrow/Return -->
                <div class="management-card">
                    <h3>Borrow or Return</h3>
                    <form method="POST">
                        <div class="form-group">
                            <label for="member_id">Member</label>
                            <select name="member_id" id="borrow-member" required>
                                <option value="">Select Member</option>
                                <?php foreach ($members as $m): ?>
                                    <option value="<?php echo $m['id']; ?>"><?php echo htmlspecialchars($m['name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="book_id">Book</label>
                            <select name="book_id" id="borrow-book" required onchange="updateManageButton()">
                                <option value="">Select Book</option>
                                <?php foreach ($books as $b): ?>
                                    <option value="<?php echo $b['id']; ?>" data-available="<?php echo $b['available']; ?>">
                                        <?php echo htmlspecialchars($b['title']); ?> (<?php echo $b['available'] ? 'Available' : 'Borrowed'; ?>)
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <input type="hidden" name="loan_action" id="loan_action_input" value="borrow">
                        <button type="submit" id="borrow-btn" class="btn-primary"><i data-lucide="arrow-right-left"></i> Borrow Book</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>

<script>
function updateManageButton() {
    const bookSelect = document.getElementById('borrow-book');
    const selectedOption = bookSelect.options[bookSelect.selectedIndex];
    const btn = document.getElementById('borrow-btn');
    const actionInput = document.getElementById('loan_action_input');
    
    if (selectedOption && selectedOption.value) {
        const isAvailable = selectedOption.getAttribute('data-available') == "1";
        if (isAvailable) {
            btn.innerHTML = '<i data-lucide="arrow-right-left"></i> Borrow Book';
            actionInput.value = 'borrow';
        } else {
            btn.innerHTML = '<i data-lucide="rotate-ccw"></i> Return Book';
            actionInput.value = 'return';
        }
        if (window.lucide) lucide.createIcons();
    }
}
</script>

<?php include 'php/footer.php'; ?>
