// Manage Members page functionality
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('member-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('member-name').value.trim();
        const email = document.getElementById('member-email').value.trim();

        if (!name) {
            alert('Please enter a member name.');
            return;
        }

        try {
            await createMember({ name, email });
            e.target.reset();
            alert('Member added successfully!');
        } catch (error) {
            alert(error.message);
        }
    });
});