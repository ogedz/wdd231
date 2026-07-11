// spotlight.js - Random gold/silver member spotlight cards (home page)

const membersUrl = './data/members.json';
const spotlightContainer = document.getElementById('spotlight-container');

const levelNames = {
    3: 'Gold Member',
    2: 'Silver Member',
    1: 'Member'
};

async function getSpotlightMembers() {
    try {
        const response = await fetch(membersUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const members = await response.json();
        displaySpotlights(members);
    } catch (error) {
        console.error('Spotlight fetch error:', error);
        spotlightContainer.innerHTML = `
            <p class="spotlight-loading">Unable to load member spotlights.</p>
        `;
    }
}

// Fisher-Yates shuffle
function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function displaySpotlights(members) {
    // Only Gold (3) and Silver (2) members are eligible for a spotlight
    const eligible = members.filter(member => member.membershipLevel >= 2);

    // Pick 2 or 3 at random each time the page loads
    const count = Math.min(eligible.length, Math.random() < 0.5 ? 2 : 3);
    const spotlightMembers = shuffle(eligible).slice(0, count);

    spotlightContainer.innerHTML = spotlightMembers.map(member => {
        const level = member.membershipLevel;
        const websiteUrl = member.website.startsWith('http') ? member.website : `https://www.${member.website}`;
        const websiteLabel = member.website.replace(/^https?:\/\//, '').replace(/\/$/, '');

        return `
            <article class="spotlight-card level-${level}">
                <div class="spotlight-header">
                    <span class="spotlight-badge level-${level}">${levelNames[level]}</span>
                    <h3>${member.name}</h3>
                    <p class="tagline">${member.tagline}</p>
                </div>
                <div class="spotlight-body">
                    <img src="${member.image}" alt="${member.name} logo" loading="lazy" width="90" height="90"
                         onerror="this.src='https://placehold.co/90x90/1a472a/ffffff?text=${member.name.charAt(0)}'">
                    <div class="spotlight-info">
                        <p><strong>ADDRESS:</strong> ${member.address}</p>
                        <p><strong>PHONE:</strong> <a href="tel:+${member.phone}" target="_self">${member.phone}</a></p>
                        <p><strong>URL:</strong> <a href="${websiteUrl}" target="_blank" rel="noopener noreferrer">${websiteLabel}</a></p>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

getSpotlightMembers();