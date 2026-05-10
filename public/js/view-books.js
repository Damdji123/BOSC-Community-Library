// View Books page functionality
let allBooks = [];

document.addEventListener('DOMContentLoaded', async () => {
    await displayBooks();
    document.getElementById('search-input').addEventListener('input', filterBooks);
    document.getElementById('filter-select').addEventListener('change', filterBooks);
});

async function displayBooks(booksToShow) {
    const container = document.getElementById('books-container');
    container.innerHTML = '';

    if (!booksToShow) {
        const response = await fetchBooks().catch(() => ({ data: [] }));
        allBooks = response.data || [];
        booksToShow = allBooks;
    }

    if (booksToShow.length === 0) {
        container.innerHTML = '<p>No books found.</p>';
        return;
    }

    booksToShow.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';

        const statusClass = book.available ? 'status-available' : 'status-borrowed';
        const statusText = book.available ? 'Available' : 'Borrowed';

        bookCard.innerHTML = `
            <div class="book-header">
                <h3>${book.title}</h3>
                <span class="book-status ${statusClass}">${statusText}</span>
            </div>
            <div class="book-details">
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>ID:</strong> ${book.id}</p>
                <p><strong>Borrower:</strong> ${book.borrower_name || 'None'}</p>
            </div>
        `;

        container.appendChild(bookCard);
    });
}

function filterBooks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filterValue = document.getElementById('filter-select').value;

    let filteredBooks = allBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );

    if (filterValue === 'available') {
        filteredBooks = filteredBooks.filter(book => book.available);
    } else if (filterValue === 'borrowed') {
        filteredBooks = filteredBooks.filter(book => !book.available);
    }

    displayBooks(filteredBooks);
}