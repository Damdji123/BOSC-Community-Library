from models import Library

def main():
    library = Library()

    while True:
        print("\nBOSC Community Library Management System")
        print("1. Add Book")
        print("2. Add Member")
        print("3. Borrow Book")
        print("4. Return Book")
        print("5. List Books")
        print("6. List Members")
        print("7. Exit")

        choice = input("Enter your choice: ")

        if choice == '1':
            title = input("Enter book title: ")
            author = input("Enter book author: ")
            book = library.add_book(title, author)
            print(f"Book added: {book.title} by {book.author}")

        elif choice == '2':
            name = input("Enter member name: ")
            member = library.add_member(name)
            print(f"Member added: {member.name}")

        elif choice == '3':
            member_id = int(input("Enter member ID: "))
            book_id = int(input("Enter book ID: "))
            if library.borrow_book(member_id, book_id):
                print("Book borrowed successfully")
            else:
                print("Borrow failed")

        elif choice == '4':
            member_id = int(input("Enter member ID: "))
            book_id = int(input("Enter book ID: "))
            if library.return_book(member_id, book_id):
                print("Book returned successfully")
            else:
                print("Return failed")

        elif choice == '5':
            books = library.list_books()
            for book in books:
                status = "Available" if book.available else "Borrowed"
                print(f"ID: {book.id}, Title: {book.title}, Author: {book.author}, Status: {status}")

        elif choice == '6':
            members = library.list_members()
            for member in members:
                print(f"ID: {member.id}, Name: {member.name}, Borrowed: {member.borrowed_books}")

        elif choice == '7':
            break

        else:
            print("Invalid choice")

if __name__ == "__main__":
    main()