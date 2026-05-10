// Home page functionality

document.addEventListener('DOMContentLoaded', async () => {
  await updateStats();
});

async function updateStats() {
  const booksResponse = await fetchBooks().catch(() => ({ data: [] }));
  const membersResponse = await fetchMembers().catch(() => ({ data: [] }));

  const books = booksResponse.data || [];
  const members = membersResponse.data || [];

  const totalBooks = books.length;
  const borrowedBooks = books.filter(book => !book.available).length;
  const totalMembers = members.length;

  document.getElementById('total-books').textContent = totalBooks;
  document.getElementById('total-members').textContent = totalMembers;
  document.getElementById('borrowed-books').textContent = borrowedBooks;
}
