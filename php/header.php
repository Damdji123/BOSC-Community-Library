<?php
require_once 'config.php';

// Function to show notifications from session
function displayFlashMessage() {
    if (isset($_SESSION['message'])) {
        $msg = $_SESSION['message'];
        $type = $_SESSION['message_type'] ?? 'info';
        unset($_SESSION['message']);
        unset($_SESSION['message_type']);
        echo "<div class='toast-container'><div class='toast show toast-{$type}'><span>" . ($type === 'success' ? '✅' : '❌') . "</span><span>{$msg}</span></div></div>";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BOSC Community Library</title>
    <link rel="stylesheet" href="css/styles.css">
    <script src="https://cdn.jsdelivr.net/npm/lucide@0.407.0/dist/umd/lucide.min.js"></script>
</head>
<body>
    <header>
        <nav>
            <div class="nav-container">
                <a href="index.php" class="logo"><i data-lucide="library"></i> BOSC Library</a>
                <ul class="nav-menu">
                    <li><a href="index.php">Home</a></li>
                    <li><a href="about.php">About</a></li>
                    <li><a href="manage-books.php">Manage Books</a></li>
                    <li><a href="view-books.php">View Books</a></li>
                    <li><a href="manage-members.php">Manage Members</a></li>
                    <li><a href="view-members.php">View Members</a></li>
                    <?php if (isset($_SESSION['user'])): ?>
                        <li><a href="logout.php" class="nav-button">Logout (<?php echo htmlspecialchars($_SESSION['user']['name']); ?>)</a></li>
                    <?php else: ?>
                        <li><a href="login.php">Login</a></li>
                        <li><a href="register.php" class="nav-button">Register</a></li>
                    <?php endif; ?>
                </ul>
                <div class="hamburger">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
        </nav>
    </header>
    <?php displayFlashMessage(); ?>
