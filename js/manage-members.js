// Manage Members page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Event listener for member form
    document.getElementById('member-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('member-name').value;
        const email = document.getElementById('member-email').value;
        library.addMember(name, email);
        e.target.reset();
        alert('Member added successfully!');
    });
});