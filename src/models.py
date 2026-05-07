import json
import os

class Book:
    def __init__(self, book_id, title, author):
        self.id = book_id
        self.title = title
        self.author = author
        self.available = True

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'available': self.available
        }

    @classmethod
    def from_dict(cls, data):
        book = cls(data['id'], data['title'], data['author'])
        book.available = data['available']
        return book

class Member:
    def __init__(self, member_id, name):
        self.id = member_id
        self.name = name
        self.borrowed_books = []

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'borrowed_books': self.borrowed_books
        }

    @classmethod
    def from_dict(cls, data):
        member = cls(data['id'], data['name'])
        member.borrowed_books = data['borrowed_books']
        return member

class Library:
    def __init__(self):
        self.books = []
        self.members = []
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        self.books_file = os.path.join(self.data_dir, 'books.json')
        self.members_file = os.path.join(self.data_dir, 'members.json')
        self.load_data()

    def load_data(self):
        if os.path.exists(self.books_file):
            with open(self.books_file, 'r') as f:
                books_data = json.load(f)
                self.books = [Book.from_dict(b) for b in books_data]
        if os.path.exists(self.members_file):
            with open(self.members_file, 'r') as f:
                members_data = json.load(f)
                self.members = [Member.from_dict(m) for m in members_data]

    def save_data(self):
        with open(self.books_file, 'w') as f:
            json.dump([b.to_dict() for b in self.books], f, indent=4)
        with open(self.members_file, 'w') as f:
            json.dump([m.to_dict() for m in self.members], f, indent=4)

    def add_book(self, title, author):
        book_id = len(self.books) + 1
        book = Book(book_id, title, author)
        self.books.append(book)
        self.save_data()
        return book

    def add_member(self, name):
        member_id = len(self.members) + 1
        member = Member(member_id, name)
        self.members.append(member)
        self.save_data()
        return member

    def borrow_book(self, member_id, book_id):
        member = next((m for m in self.members if m.id == member_id), None)
        book = next((b for b in self.books if b.id == book_id), None)
        if member and book and book.available:
            book.available = False
            member.borrowed_books.append(book_id)
            self.save_data()
            return True
        return False

    def return_book(self, member_id, book_id):
        member = next((m for m in self.members if m.id == member_id), None)
        book = next((b for b in self.books if b.id == book_id), None)
        if member and book and not book.available and book_id in member.borrowed_books:
            book.available = True
            member.borrowed_books.remove(book_id)
            self.save_data()
            return True
        return False

    def list_books(self):
        return self.books

    def list_members(self):
        return self.members