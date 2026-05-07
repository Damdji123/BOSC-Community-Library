// Manage Books page functionality
document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
});

// Event listeners
document.getElementById('book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    library.addBook(title, author);
    populateSelects();
    e.target.reset();
    alert('Book added successfully!');
});

document.getElementById('borrow-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const memberId = document.getElementById('borrow-member').value;
    const bookId = document.getElementById('borrow-book').value;
    const btn = document.getElementById('borrow-btn');
    const isBorrow = btn.textContent === 'Borrow Book';

    let success;
    if (isBorrow) {
        success = library.borrowBook(memberId, bookId);
    } else {
        success = library.returnBook(memberId, bookId);
    }

    if (success) {
        populateSelects();
        alert(isBorrow ? 'Book borrowed successfully!' : 'Book returned successfully!');
    } else {
        alert(isBorrow ? 'Failed to borrow book.' : 'Failed to return book.');
    }
});

// Toggle borrow/return button
document.getElementById('borrow-member').addEventListener('change', updateButton);
document.getElementById('borrow-book').addEventListener('change', updateButton);

function updateButton() {
    const memberId = document.getElementById('borrow-member').value;
    const bookId = document.getElementById('borrow-book').value;
    const btn = document.getElementById('borrow-btn');

    if (memberId && bookId) {
        const member = library.members.find(m => m.id == memberId);
        const book = library.books.find(b => b.id == bookId);
        if (member && book) {
            if (book.available) {
                btn.textContent = 'Borrow Book';
            } else if (member.borrowedBooks.includes(parseInt(bookId))) {
                btn.textContent = 'Return Book';
            } else {
                btn.textContent = 'Borrow Book';
            }
        }
    }
}

function populateSelects() {
    const memberSelect = document.getElementById('borrow-member');
    const bookSelect = document.getElementById('borrow-book');

    memberSelect.innerHTML = '<option value="">Select Member</option>';
    library.members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.name;
        memberSelect.appendChild(option);
    });

    bookSelect.innerHTML = '<option value="">Select Book</option>';
    library.books.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = `${book.title} by ${book.author}`;
        bookSelect.appendChild(option);
    });
}