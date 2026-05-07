// Home page functionality
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
});

function updateStats() {
    const stats = library.getStats();
    document.getElementById('total-books').textContent = stats.totalBooks;
    document.getElementById('total-members').textContent = stats.totalMembers;
    document.getElementById('borrowed-books').textContent = stats.borrowedBooks;
}