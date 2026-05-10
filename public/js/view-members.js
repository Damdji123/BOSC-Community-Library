// View Members page functionality
document.addEventListener('DOMContentLoaded', async () => {
    await displayMembers();
});

async function displayMembers() {
    const container = document.getElementById('members-container');
    container.innerHTML = '';

    const response = await fetchMembers().catch(() => ({ data: [] }));
    const members = response.data || [];

    if (members.length === 0) {
        container.innerHTML = '<p>No members found.</p>';
        return;
    }

    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';

        memberCard.innerHTML = `
            <h3>${member.name}</h3>
            <p><strong>ID:</strong> ${member.id}</p>
            ${member.email ? `<p><strong>Email:</strong> ${member.email}</p>` : ''}
            <div class="member-stats">
                <p><strong>Joined:</strong> ${new Date(member.created_at).toLocaleDateString()}</p>
            </div>
        `;

        container.appendChild(memberCard);
    });
}