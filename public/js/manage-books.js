// Manage Books page functionality
let currentBooks = [];
let currentMembers = [];

document.addEventListener('DOMContentLoaded', async () => {
    await populateSelects();
});

// Event listeners
document.getElementById('book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();

    if (!title || !author) {
        alert('Please provide both book title and author.');
        return;
    }

    try {
        await createBook({ title, author });
        await populateSelects();
        e.target.reset();
        alert('Book added successfully!');
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('borrow-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const memberId = document.getElementById('borrow-member').value;
    const bookId = document.getElementById('borrow-book').value;
    const btn = document.getElementById('borrow-btn');
    const action = btn.textContent.trim();

    if (!memberId || !bookId) {
        alert('Select both a member and a book.');
        return;
    }

    try {
        if (action === 'Borrow Book') {
            await borrowBook({ memberId, bookId });
            alert('Book borrowed successfully!');
        } else {
            await returnBook({ bookId });
            alert('Book returned successfully!');
        }
        await populateSelects();
    } catch (error) {
        alert(error.message);
    }
});

// Toggle borrow/return button
document.getElementById('borrow-member').addEventListener('change', updateButton);
document.getElementById('borrow-book').addEventListener('change', updateButton);

function updateButton() {
    const bookId = document.getElementById('borrow-book').value;
    const btn = document.getElementById('borrow-btn');
    const book = currentBooks.find(b => String(b.id) === String(bookId));

    if (!book) {
        btn.textContent = 'Borrow Book';
        return;
    }

    btn.textContent = book.available ? 'Borrow Book' : 'Return Book';
}

async function populateSelects() {
    const memberSelect = document.getElementById('borrow-member');
    const bookSelect = document.getElementById('borrow-book');

    const membersResponse = await fetchMembers().catch(() => ({ members: [] }));
    const booksResponse = await fetchBooks().catch(() => ({ books: [] }));

    currentMembers = membersResponse.members;
    currentBooks = booksResponse.books;

    memberSelect.innerHTML = '<option value="">Select Member</option>';
    currentMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.name;
        memberSelect.appendChild(option);
    });

    bookSelect.innerHTML = '<option value="">Select Book</option>';
    currentBooks.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = `${book.title} by ${book.author}`;
        bookSelect.appendChild(option);
    });

    updateButton();
}