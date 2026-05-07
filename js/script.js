// Library Management System

class Book {
    constructor(id, title, author) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.available = true;
    }
}

class Member {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.borrowedBooks = [];
    }
}

class Library {
    constructor() {
        this.books = this.loadBooks();
        this.members = this.loadMembers();
    }

    loadBooks() {
        const books = localStorage.getItem('books');
        return books ? JSON.parse(books).map(b => Object.assign(new Book(), b)) : [];
    }

    loadMembers() {
        const members = localStorage.getItem('members');
        return members ? JSON.parse(members).map(m => Object.assign(new Member(), m)) : [];
    }

    saveBooks() {
        localStorage.setItem('books', JSON.stringify(this.books));
    }

    saveMembers() {
        localStorage.setItem('members', JSON.stringify(this.members));
    }

    addBook(title, author) {
        const id = this.books.length + 1;
        const book = new Book(id, title, author);
        this.books.push(book);
        this.saveBooks();
        return book;
    }

    addMember(name) {
        const id = this.members.length + 1;
        const member = new Member(id, name);
        this.members.push(member);
        this.saveMembers();
        return member;
    }

    borrowBook(memberId, bookId) {
        const member = this.members.find(m => m.id == memberId);
        const book = this.books.find(b => b.id == bookId);
        if (member && book && book.available) {
            book.available = false;
            member.borrowedBooks.push(bookId);
            this.saveBooks();
            this.saveMembers();
            return true;
        }
        return false;
    }

    returnBook(memberId, bookId) {
        const member = this.members.find(m => m.id == memberId);
        const book = this.books.find(b => b.id == bookId);
        if (member && book && !book.available && member.borrowedBooks.includes(bookId)) {
            book.available = true;
            member.borrowedBooks = member.borrowedBooks.filter(id => id != bookId);
            this.saveBooks();
            this.saveMembers();
            return true;
        }
        return false;
    }

    displayBooks() {
        const ul = document.getElementById('books-ul');
        ul.innerHTML = '';
        this.books.forEach(book => {
            const li = document.createElement('li');
            li.textContent = `${book.title} by ${book.author} - ${book.available ? 'Available' : 'Borrowed'}`;
            if (!book.available) li.classList.add('borrowed');
            ul.appendChild(li);
        });
    }

    displayMembers() {
        const ul = document.getElementById('members-ul');
        ul.innerHTML = '';
        this.members.forEach(member => {
            const li = document.createElement('li');
            li.textContent = `${member.name} - Borrowed: ${member.borrowedBooks.length} books`;
            ul.appendChild(li);
        });
    }

    populateSelects() {
        const memberSelect = document.getElementById('borrow-member');
        const bookSelect = document.getElementById('borrow-book');

        memberSelect.innerHTML = '<option value="">Select Member</option>';
        this.members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            memberSelect.appendChild(option);
        });

        bookSelect.innerHTML = '<option value="">Select Book</option>';
        this.books.forEach(book => {
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = `${book.title} by ${book.author}`;
            bookSelect.appendChild(option);
        });
    }
}

// Initialize library
const library = new Library();

// Event listeners
document.getElementById('book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    library.addBook(title, author);
    library.displayBooks();
    library.populateSelects();
    e.target.reset();
});

document.getElementById('member-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('member-name').value;
    library.addMember(name);
    library.displayMembers();
    library.populateSelects();
    e.target.reset();
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
        library.displayBooks();
        library.displayMembers();
        library.populateSelects();
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

// Initial display
library.displayBooks();
library.displayMembers();
library.populateSelects();