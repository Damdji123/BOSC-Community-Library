// Manage Members page functionality
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('member-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('member-name').value.trim();
        const email = document.getElementById('member-email').value.trim();

        if (!name) {
            showNotification('Please enter a member name.', 'error');
            return;
        }

        try {
            await createMember({ name, email });
            e.target.reset();
            showNotification('Member added successfully!', 'success');
        } catch (error) {
            // Already handled by apiFetch toast
        }
    });
});