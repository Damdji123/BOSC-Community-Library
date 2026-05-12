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
        showNotification('Please provide both book title and author.', 'error');
        return;
    }

    try {
        await createBook({ title, author });
        await populateSelects();
        e.target.reset();
        showNotification('Book added successfully!', 'success');
    } catch (error) {
        // Handled by apiFetch toast
    }
});

document.getElementById('borrow-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const memberId = document.getElementById('borrow-member').value;
    const bookId = document.getElementById('borrow-book').value;
    const btn = document.getElementById('borrow-btn');
    const action = btn.textContent.trim();

    if (!memberId || !bookId) {
        showNotification('Select both a member and a book.', 'error');
        return;
    }

    try {
        if (action === 'Borrow Book') {
            await borrowBook({ member_id: memberId, book_id: bookId });
            showNotification('Book borrowed successfully!', 'success');
        } else {
            await returnBook({ book_id: bookId });
            showNotification('Book returned successfully!', 'success');
        }
        await populateSelects();
    } catch (error) {
        // Handled by apiFetch toast
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
        btn.innerHTML = '<i data-lucide="arrow-right-left"></i> Borrow Book';
        if (window.lucide) lucide.createIcons();
        return;
    }

    const isAvailable = (book.available == 1);
    btn.innerHTML = isAvailable 
        ? '<i data-lucide="arrow-right-left"></i> Borrow Book' 
        : '<i data-lucide="rotate-ccw"></i> Return Book';
    if (window.lucide) lucide.createIcons();
}

async function populateSelects() {
    const memberSelect = document.getElementById('borrow-member');
    const bookSelect = document.getElementById('borrow-book');

    const membersResponse = await fetchMembers().catch(() => ({ data: [] }));
    const booksResponse = await fetchBooks().catch(() => ({ data: [] }));

    currentMembers = membersResponse.data || [];
    currentBooks = booksResponse.data || [];

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