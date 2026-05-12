<?php
require_once 'php/header.php';

$db = getDbConnection();

// Handle Delete
if (isset($_GET['delete']) && isset($_SESSION['user'])) {
    $id = (int)$_GET['delete'];
    $db->prepare("DELETE FROM books WHERE id = ?")->execute([$id]);
    $_SESSION['message'] = "Book removed from collection.";
    $_SESSION['message_type'] = "success";
    header("Location: view-books.php");
    exit;
}

// Handle Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_book'])) {
    $id = (int)$_POST['id'];
    $title = trim($_POST['title']);
    $author = trim($_POST['author']);
    $stmt = $db->prepare("UPDATE books SET title = ?, author = ? WHERE id = ?");
    $stmt->execute([$title, $author, $id]);
    $_SESSION['message'] = "Book details updated.";
    $_SESSION['message_type'] = "success";
    header("Location: view-books.php");
    exit;
}

$editBook = null;
if (isset($_GET['edit']) && isset($_SESSION['user'])) {
    $id = (int)$_GET['edit'];
    $stmt = $db->prepare("SELECT * FROM books WHERE id = ?");
    $stmt->execute([$id]);
    $editBook = $stmt->fetch();
}

$query = "
    SELECT b.*, m.name as borrower_name 
    FROM books b
    LEFT JOIN loans l ON b.id = l.book_id AND l.return_date IS NULL
    LEFT JOIN members m ON l.member_id = m.id
    ORDER BY b.created_at DESC
";
$books = $db->query($query)->fetchAll();
?>

<main>
    <section class="page-header">
        <div class="container">
            <h2>Our Collection</h2>
            <p>Explore the vast world of books available in our library</p>
        </div>
    </section>

    <?php if ($editBook): ?>
    <section class="edit-section" style="padding-top: 40px;">
        <div class="container">
            <div class="management-card" style="max-width: 500px; margin: 0 auto;">
                <h3>Edit Book</h3>
                <form method="POST">
                    <input type="hidden" name="update_book" value="1">
                    <input type="hidden" name="id" value="<?php echo $editBook['id']; ?>">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value="<?php echo htmlspecialchars($editBook['title']); ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Author</label>
                        <input type="text" name="author" value="<?php echo htmlspecialchars($editBook['author']); ?>" required>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button type="submit" class="btn-primary">Update Book</button>
                        <a href="view-books.php" class="btn-primary" style="background: #64748b;">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <section class="books-section">
        <div class="container">
            <div class="books-grid">
                <?php if (empty($books)): ?>
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                        <p style="font-size: 1.2rem; color: var(--text-muted);">The library is currently empty. <a href="manage-books.php">Add your first book!</a></p>
                    </div>
                <?php else: ?>
                    <?php foreach ($books as $book): ?>
                        <div class="book-card">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div class="book-icon" style="font-size: 2rem; margin-bottom: 15px;">📚</div>
                                <?php if (isset($_SESSION['user'])): ?>
                                    <div style="display: flex; gap: 8px;">
                                        <a href="?edit=<?php echo $book['id']; ?>" style="color: var(--accent);"><i data-lucide="edit-3" style="width: 18px;"></i></a>
                                        <a href="?delete=<?php echo $book['id']; ?>" style="color: #ef4444;" onclick="return confirm('Remove this book from collection?')"><i data-lucide="trash-2" style="width: 18px;"></i></a>
                                    </div>
                                <?php endif; ?>
                            </div>
                            <h3><?php echo htmlspecialchars($book['title']); ?></h3>
                            <p><strong>Author:</strong> <?php echo htmlspecialchars($book['author']); ?></p>
                            <div class="book-status" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border);">
                                <?php if ($book['available']): ?>
                                    <span class="status-available" style="color: var(--accent); font-weight: 600;">● Available</span>
                                <?php else: ?>
                                    <span class="status-borrowed" style="color: #ef4444; font-weight: 600;">● Borrowed by <?php echo htmlspecialchars($book['borrower_name']); ?></span>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </section>
</main>

<?php include 'php/footer.php'; ?>
