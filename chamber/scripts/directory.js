// directory.js - Chamber Directory Page functionality

// Use absolute path to ensure it works on GitHub Pages
const membersUrl = './data/members.json';
const cardsContainer = document.getElementById('members-container');
const gridBtn = document.getElementById('grid-view');
const listBtn = document.getElementById('list-view');

// Fetch member data
async function getMembers() {
    try {
        console.log('Fetching from:', membersUrl);
        const response = await fetch(membersUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Data loaded:', data.length, 'members');
        displayMembers(data);
    } catch (error) {
        console.error('Fetch error:', error);
        cardsContainer.innerHTML = `
            <p class="error" style="text-align:center; padding:2rem;">
                Unable to load member data.<br>
                Error: ${error.message}<br>
                <small>Make sure data/members.json exists in your repo</small>
            </p>
        `;
    }
}

// Display members - WIREFRAME CARD STRUCTURE
function displayMembers(members) {
    cardsContainer.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('article');
        card.className = 'member-card';

        card.innerHTML = `
            <div class="member-header">
                <h3>${member.name}</h3>
                <p class="tagline">${member.tagline}</p>
            </div>
            <div class="member-body">
                <img src="${member.image}" alt="${member.name} logo" loading="lazy" width="100" height="100" onerror="this.src='https://placehold.co/100x100/1a472a/ffffff?text=${member.name.charAt(0)}'">
                <div class="member-details">
                    <p><strong>EMAIL:</strong> info@${member.website}</p>
                    <p><strong>PHONE:</strong> ${member.phone}</p>
                    <p><strong>URL:</strong> <a href="https://www.${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
                </div>
            </div>
        `;

        cardsContainer.appendChild(card);
    });
}

// Toggle Grid View
function setGridView() {
    cardsContainer.className = 'members-grid';
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    gridBtn.setAttribute('aria-pressed', 'true');
    listBtn.setAttribute('aria-pressed', 'false');
    localStorage.setItem('directoryView', 'grid');
}

// Toggle List View
function setListView() {
    cardsContainer.className = 'members-list';
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    listBtn.setAttribute('aria-pressed', 'true');
    gridBtn.setAttribute('aria-pressed', 'false');
    localStorage.setItem('directoryView', 'list');
}

gridBtn.addEventListener('click', setGridView);
listBtn.addEventListener('click', setListView);

// Check saved view preference
const savedView = localStorage.getItem('directoryView');
if (savedView === 'list') {
    setListView();
} else {
    setGridView();
}

// Initial load
getMembers();