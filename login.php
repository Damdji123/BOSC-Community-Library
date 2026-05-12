<?php
require_once 'php/header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $_SESSION['message'] = "Please enter your email and password.";
        $_SESSION['message_type'] = "error";
    } else {
        try {
            $db = getDbConnection();
            $stmt = $db->prepare("SELECT * FROM members WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && ($user['password_hash'] === null || password_verify($password, $user['password_hash']))) {
                $_SESSION['user'] = [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email']
                ];
                $_SESSION['message'] = "Welcome back, " . $user['name'] . "!";
                $_SESSION['message_type'] = "success";
                header("Location: index.php");
                exit;
            } else {
                $_SESSION['message'] = "Invalid email or password.";
                $_SESSION['message_type'] = "error";
            }
        } catch (PDOException $e) {
            $_SESSION['message'] = "Login failed: " . $e->getMessage();
            $_SESSION['message_type'] = "error";
        }
    }
}
?>

<main>
    <section class="auth-page">
        <div class="container">
            <div class="auth-card">
                <h2 class="auth-title">Librarian Login</h2>
                <p>Welcome back! Please login to your account.</p>
                
                <form action="login.php" method="POST">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input name="email" type="email" placeholder="Enter your email" required value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" />
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input name="password" type="password" placeholder="Enter your password" required />
                    </div>
                    <button type="submit" class="btn-primary">Login</button>
                </form>
                <div class="form-links">
                    <a href="forgot-password.php">Forgot password?</a>
                    <a href="register.php">Need an account? Register</a>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include 'php/footer.php'; ?>
