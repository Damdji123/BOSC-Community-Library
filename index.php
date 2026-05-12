<?php
require_once 'php/header.php';

$db = getDbConnection();
$totalBooks = $db->query("SELECT COUNT(*) FROM books")->fetchColumn();
$totalMembers = $db->query("SELECT COUNT(*) FROM members")->fetchColumn();
$borrowedBooks = $db->query("SELECT COUNT(*) FROM books WHERE available = 0")->fetchColumn();
?>

<main>
    <section class="hero">
        <div class="hero-content">
            <h2>Welcome to BOSC Community Library</h2>
            <p>Your gateway to knowledge and discovery. Explore our vast collection of books and join our community of readers.</p>
            <a href="manage-books.php" class="btn-primary">Get Started</a>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2>Our Services</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <h3>📚 Vast Collection</h3>
                    <p>Access thousands of books across various genres and subjects.</p>
                </div>
                <div class="feature-card">
                    <h3>👥 Community Focused</h3>
                    <p>Join a vibrant community of book lovers and share your passion for reading.</p>
                </div>
                <div class="feature-card">
                    <h3>🔄 Easy Borrowing</h3>
                    <p>Simple and intuitive system for borrowing and returning books.</p>
                </div>
                <div class="feature-card">
                    <h3>📱 Online Management</h3>
                    <p>Manage your library activities from anywhere with our web platform.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="stats">
        <div class="container">
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; text-align: center; padding: 60px 0;">
                <div class="stat">
                    <h3 style="font-size: 3rem; color: var(--accent);"><?php echo $totalBooks; ?></h3>
                    <p>Books in Collection</p>
                </div>
                <div class="stat">
                    <h3 style="font-size: 3rem; color: var(--accent);"><?php echo $totalMembers; ?></h3>
                    <p>Active Members</p>
                </div>
                <div class="stat">
                    <h3 style="font-size: 3rem; color: var(--accent);"><?php echo $borrowedBooks; ?></h3>
                    <p>Books Currently Borrowed</p>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include 'php/footer.php'; ?>
