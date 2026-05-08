// Home page functionality

document.addEventListener('DOMContentLoaded', async () => {
  await updateStats();
});

async function updateStats() {
  const booksResponse = await fetchBooks().catch(() => ({ books: [] }));
  const membersResponse = await fetchMembers().catch(() => ({ members: [] }));

  const totalBooks = booksResponse.books.length;
  const borrowedBooks = booksResponse.books.filter(book => !book.available).length;
  const totalMembers = membersResponse.members.length;

  document.getElementById('total-books').textContent = totalBooks;
  document.getElementById('total-members').textContent = totalMembers;
  document.getElementById('borrowed-books').textContent = borrowedBooks;
}
