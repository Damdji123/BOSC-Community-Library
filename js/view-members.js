// View Members page functionality
document.addEventListener('DOMContentLoaded', () => {
    displayMembers();
});

function displayMembers() {
    const container = document.getElementById('members-container');
    container.innerHTML = '';

    if (library.members.length === 0) {
        container.innerHTML = '<p>No members found.</p>';
        return;
    }

    library.members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';

        memberCard.innerHTML = `
            <h3>${member.name}</h3>
            <p><strong>ID:</strong> ${member.id}</p>
            ${member.email ? `<p><strong>Email:</strong> ${member.email}</p>` : ''}
            <div class="member-stats">
                <p><strong>Books Borrowed:</strong> ${member.borrowedBooks.length}</p>
            </div>
        `;

        container.appendChild(memberCard);
    });
}