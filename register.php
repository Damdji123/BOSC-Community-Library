<?php
require_once 'php/header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm = $_POST['confirm_password'] ?? '';

    if (empty($name) || empty($email) || empty($password)) {
        $_SESSION['message'] = "All fields are required.";
        $_SESSION['message_type'] = "error";
    } elseif ($password !== $confirm) {
        $_SESSION['message'] = "Passwords do not match.";
        $_SESSION['message_type'] = "error";
    } else {
        try {
            $db = getDbConnection();
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $db->prepare("INSERT INTO members (name, email, password_hash) VALUES (?, ?, ?)");
            $stmt->execute([$name, $email, $hash]);
            
            $_SESSION['user'] = [
                'id' => $db->lastInsertId(),
                'name' => $name,
                'email' => $email
            ];
            $_SESSION['message'] = "Account created successfully!";
            $_SESSION['message_type'] = "success";
            header("Location: index.php");
            exit;
        } catch (PDOException $e) {
            $_SESSION['message'] = ($e->getCode() == 23000) ? "Email already registered." : "Error: " . $e->getMessage();
            $_SESSION['message_type'] = "error";
        }
    }
}
?>

<main>
    <section class="auth-page">
        <div class="container">
            <div class="auth-card">
                <h2 class="auth-title">Register Librarian</h2>
                <p>Create your librarian account to manage the BOSC Community Library.</p>
                
                <form action="register.php" method="POST">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input name="name" type="text" placeholder="Enter full name" required value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>" />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input name="email" type="email" placeholder="Enter your email" required value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" />
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input name="password" type="password" placeholder="Create a password" required />
                    </div>
                    <div class="form-group">
                        <label for="confirm_password">Confirm Password</label>
                        <input name="confirm_password" type="password" placeholder="Confirm your password" required />
                    </div>
                    <button type="submit" class="btn-primary">Register</button>
                </form>
                <div class="form-links">
                    <a href="login.php">Already have an account?</a>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include 'php/footer.php'; ?>
