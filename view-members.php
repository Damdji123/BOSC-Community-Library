<?php
require_once 'php/header.php';

$db = getDbConnection();
$members = $db->query("SELECT * FROM members ORDER BY created_at DESC")->fetchAll();
?>

<main>
    <section class="page-header">
        <div class="container">
            <h2>Our Members</h2>
            <p>Meet the wonderful people in our reading community</p>
        </div>
    </section>

    <section class="members-section">
        <div class="container">
            <div class="members-grid">
                <?php if (empty($members)): ?>
                    <p>No members found.</p>
                <?php else: ?>
                    <?php foreach ($members as $member): ?>
                        <div class="member-card">
                            <h3><?php echo htmlspecialchars($member['name']); ?></h3>
                            <p><strong>ID:</strong> <?php echo $member['id']; ?></p>
                            <?php if ($member['email']): ?>
                                <p><strong>Email:</strong> <?php echo htmlspecialchars($member['email']); ?></p>
                            <?php endif; ?>
                            <div class="member-stats">
                                <p><strong>Joined:</strong> <?php echo date('M d, Y', strtotime($member['created_at'])); ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </section>
</main>

<?php include 'php/footer.php'; ?>
