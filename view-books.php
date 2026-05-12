<?php
require_once 'php/header.php';

$db = getDbConnection();
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

    <section class="books-section">
        <div class="container">
            <div class="books-grid">
                <?php if (empty($books)): ?>
                    <p>No books found in the collection.</p>
                <?php else: ?>
                    <?php foreach ($books as $book): ?>
                        <div class="book-card">
                            <div class="book-icon" style="font-size: 2rem; margin-bottom: 15px;">📚</div>
                            <h3><?php echo htmlspecialchars($book['title']); ?></h3>
                            <p><strong>Author:</strong> <?php echo htmlspecialchars($book['author']); ?></p>
                            <div class="book-status">
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
