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
    constructor(id, name, email = '') {
        this.id = id;
        this.name = name;
        this.email = email;
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

    addMember(name, email = '') {
        const id = this.members.length + 1;
        const member = new Member(id, name, email);
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

    getStats() {
        const totalBooks = this.books.length;
        const borrowedBooks = this.books.filter(b => !b.available).length;
        const totalMembers = this.members.length;
        return { totalBooks, borrowedBooks, totalMembers };
    }
}

// Global library instance
const library = new Library();

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });
    }
});