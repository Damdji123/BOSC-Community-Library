// View Members page functionality
let allMembers = [];

document.addEventListener('DOMContentLoaded', async () => {
    await displayMembers();
    document.getElementById('search-input').addEventListener('input', filterAndSortMembers);
    document.getElementById('sort-select').addEventListener('change', filterAndSortMembers);
});

async function displayMembers(membersToShow) {
    const container = document.getElementById('members-container');
    container.innerHTML = '';

    if (!membersToShow) {
        const response = await fetchMembers().catch(() => ({ members: [] }));
        allMembers = response.members || [];
        membersToShow = allMembers;
    }

    if (!membersToShow || membersToShow.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p>No members found. Try adjusting your search.</p></div>';
        return;
    }

    const resultCountDiv = document.createElement('div');
    resultCountDiv.style.cssText = 'grid-column: 1 / -1; color: #4a6f81; font-size: 0.95rem; margin-bottom: 10px;';
    resultCountDiv.textContent = `Found ${membersToShow.length} member${membersToShow.length !== 1 ? 's' : ''}`;
    container.appendChild(resultCountDiv);

    membersToShow.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';

        memberCard.innerHTML = `
            <h3>${member.name}</h3>
            <p><strong>ID:</strong> ${member.id}</p>
            ${member.email ? `<p><strong>Email:</strong> <a href="mailto:${member.email}" style="color: #0b5d90; text-decoration: none;">${member.email}</a></p>` : '<p><strong>Email:</strong> Not provided</p>'}
            <div class="member-stats">
                <p><strong>Joined:</strong> ${new Date(member.created_at).toLocaleDateString()}</p>
            </div>
        `;

        container.appendChild(memberCard);
    });
}

function filterAndSortMembers() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortValue = document.getElementById('sort-select').value;

    let filteredMembers = allMembers.filter(member =>
        (member.name.toLowerCase().includes(searchTerm) ||
         (member.email && member.email.toLowerCase().includes(searchTerm)))
    );

    // Apply sorting
    filteredMembers.sort((a, b) => {
        switch (sortValue) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'date-newest':
                return new Date(b.created_at) - new Date(a.created_at);
            case 'date-oldest':
                return new Date(a.created_at) - new Date(b.created_at);
            default:
                return 0;
        }
    });

    displayMembers(filteredMembers);
}