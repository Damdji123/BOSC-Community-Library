<?php
require_once 'php/header.php';

// Check if logged in
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}

$db = getDbConnection();
$editMember = null;

// Handle Delete
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $db->prepare("DELETE FROM members WHERE id = ?")->execute([$id]);
    $_SESSION['message'] = "Member deleted successfully!";
    $_SESSION['message_type'] = "success";
    header("Location: manage-members.php");
    exit;
}

// Handle Add/Update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $id = isset($_POST['id']) ? (int)$_POST['id'] : null;
    
    if (!empty($name)) {
        try {
            if ($id) {
                $stmt = $db->prepare("UPDATE members SET name = ?, email = ? WHERE id = ?");
                $stmt->execute([$name, $email, $id]);
                $_SESSION['message'] = "Member updated successfully!";
            } else {
                $stmt = $db->prepare("INSERT INTO members (name, email) VALUES (?, ?)");
                $stmt->execute([$name, $email]);
                $_SESSION['message'] = "Member added successfully!";
            }
            $_SESSION['message_type'] = "success";
            header("Location: manage-members.php");
            exit;
        } catch (PDOException $e) {
            $_SESSION['message'] = ($e->getCode() == 23000) ? "Email already exists." : "Error: " . $e->getMessage();
            $_SESSION['message_type'] = "error";
        }
    }
}

// Fetch member for editing
if (isset($_GET['edit'])) {
    $id = (int)$_GET['edit'];
    $stmt = $db->prepare("SELECT * FROM members WHERE id = ?");
    $stmt->execute([$id]);
    $editMember = $stmt->fetch();
}

// Fetch all members
$members = $db->query("SELECT * FROM members ORDER BY created_at DESC")->fetchAll();
?>

<main>
    <section class="page-header">
        <div class="container">
            <h2>Manage Members</h2>
            <p>Add, edit, or remove library community members</p>
        </div>
    </section>

    <section class="management-section">
        <div class="container">
            <div class="management-grid">
                <!-- Form Card -->
                <div class="management-card">
                    <h3><?php echo $editMember ? 'Edit Member' : 'Add New Member'; ?></h3>
                    <form action="manage-members.php" method="POST">
                        <?php if ($editMember): ?>
                            <input type="hidden" name="id" value="<?php echo $editMember['id']; ?>">
                        <?php endif; ?>
                        <div class="form-group">
                            <label for="name">Member Name</label>
                            <input type="text" name="name" placeholder="Enter full name" required value="<?php echo $editMember ? htmlspecialchars($editMember['name']) : ''; ?>">
                        </div>
                        <div class="form-group">
                            <label for="email">Email (Optional)</label>
                            <input type="email" name="email" placeholder="Enter email address" value="<?php echo $editMember ? htmlspecialchars($editMember['email']) : ''; ?>">
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button type="submit" class="btn-primary">
                                <i data-lucide="<?php echo $editMember ? 'save' : 'user-plus'; ?>"></i> 
                                <?php echo $editMember ? 'Update Member' : 'Add Member'; ?>
                            </button>
                            <?php if ($editMember): ?>
                                <a href="manage-members.php" class="btn-primary" style="background: #64748b;">Cancel</a>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>

                <!-- List Card -->
                <div class="management-card">
                    <h3>Current Members</h3>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                            <thead>
                                <tr style="text-align: left; border-bottom: 2px solid var(--border);">
                                    <th style="padding: 10px;">Name</th>
                                    <th style="padding: 10px;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($members as $m): ?>
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 10px;">
                                            <strong><?php echo htmlspecialchars($m['name']); ?></strong><br>
                                            <small style="color: var(--text-muted);"><?php echo htmlspecialchars($m['email']); ?></small>
                                        </td>
                                        <td style="padding: 10px; display: flex; gap: 8px;">
                                            <a href="?edit=<?php echo $m['id']; ?>" style="color: var(--accent);"><i data-lucide="edit-3"></i></a>
                                            <a href="?delete=<?php echo $m['id']; ?>" style="color: #ef4444;" onclick="return confirm('Delete this member?')"><i data-lucide="trash-2"></i></a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include 'php/footer.php'; ?>
