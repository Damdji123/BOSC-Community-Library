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
        const response = await fetchBooks().catch(() => ({ books: [] }));
        allBooks = response.books;
        booksToShow = allBooks;
    }

    if (booksToShow.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p>No books found. Try adjusting your search or filter.</p></div>';
        return;
    }

    const resultCountDiv = document.createElement('div');
    resultCountDiv.style.cssText = 'grid-column: 1 / -1; color: #4a6f81; font-size: 0.95rem; margin-bottom: 10px;';
    resultCountDiv.textContent = `Found ${booksToShow.length} book${booksToShow.length !== 1 ? 's' : ''}`;
    container.appendChild(resultCountDiv);

    booksToShow.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';

        const statusClass = book.available ? 'status-available' : 'status-borrowed';
        const statusText = book.available ? 'Available' : 'Borrowed';
        const borrowedDate = book.borrowed_at ? new Date(book.borrowed_at).toLocaleDateString() : 'N/A';

        bookCard.innerHTML = `
            <div class="book-header">
                <h3>${book.title}</h3>
                <span class="book-status ${statusClass}">${statusText}</span>
            </div>
            <div class="book-details">
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>ID:</strong> ${book.id}</p>
                <p><strong>Borrower:</strong> ${book.borrower_name || 'None'}</p>
                ${!book.available ? `<p><strong>Borrowed Date:</strong> ${borrowedDate}</p>` : ''}
            </div>
        `;

        container.appendChild(bookCard);
    });
}

function filterBooks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filterValue = document.getElementById('filter-select').value;

    let filteredBooks = allBooks.filter(book =>
        (book.title.toLowerCase().includes(searchTerm) ||
         book.author.toLowerCase().includes(searchTerm))
    );

    if (filterValue === 'available') {
        filteredBooks = filteredBooks.filter(book => book.available);
    } else if (filterValue === 'borrowed') {
        filteredBooks = filteredBooks.filter(book => !book.available);
    }

    displayBooks(filteredBooks);
}