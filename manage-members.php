<?php
require_once 'php/header.php';

// Check if logged in
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}

$db = getDbConnection();

// Handle Add Member
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    
    if (!empty($name)) {
        try {
            $stmt = $db->prepare("INSERT INTO members (name, email) VALUES (?, ?)");
            $stmt->execute([$name, $email]);
            $_SESSION['message'] = "Member added successfully!";
            $_SESSION['message_type'] = "success";
        } catch (PDOException $e) {
            $_SESSION['message'] = ($e->getCode() == 23000) ? "Email already exists." : "Error: " . $e->getMessage();
            $_SESSION['message_type'] = "error";
        }
    } else {
        $_SESSION['message'] = "Member name is required.";
        $_SESSION['message_type'] = "error";
    }
}
?>

<main>
    <section class="page-header">
        <div class="container">
            <h2>Manage Members</h2>
            <p>Add new members to the library community</p>
        </div>
    </section>

    <section class="management-section">
        <div class="container">
            <div class="management-card" style="max-width: 600px; margin: 0 auto;">
                <h3>Add New Member</h3>
                <form action="manage-members.php" method="POST">
                    <div class="form-group">
                        <label for="name">Member Name</label>
                        <input type="text" name="name" placeholder="Enter full name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email (Optional)</label>
                        <input type="email" name="email" placeholder="Enter email address">
                    </div>
                    <button type="submit" class="btn-primary"><i data-lucide="user-plus"></i> Add Member</button>
                </form>
            </div>
        </div>
    </section>
</main>

<?php include 'php/footer.php'; ?>
