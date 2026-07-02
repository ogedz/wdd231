// spotlight.js - Dynamic business spotlight cards

const members = [
    {
        name: "Ife Grand Hotel",
        tagline: "Luxury hospitality in the heart of the city",
        image: "https://placehold.co/80x80/1a472a/ffffff?text=IGH",
        email: "info@ifegrandhotel.com",
        phone: "234-555-0101",
        url: "www.ifegrandhotel.com"
    },
    {
        name: "Oduduwa Tech Solutions",
        tagline: "Innovation rooted in tradition",
        image: "https://placehold.co/80x80/c9a227/ffffff?text=OTS",
        email: "contact@oduduwa.tech",
        phone: "234-555-0102",
        url: "www.oduduwa.tech"
    },
    {
        name: "OAU Bookstore",
        tagline: "Knowledge for every generation",
        image: "https://placehold.co/80x80/b85c38/ffffff?text=OAU",
        email: "sales@oaubooks.edu.ng",
        phone: "234-555-0103",
        url: "www.oaubooks.edu.ng"
    }
];

function renderSpotlights() {
    const container = document.getElementById('spotlight-container');
    if (!container) return;

    // Filter gold/silver members and pick 3 random
    const spotlightMembers = members.slice(0, 3);

    container.innerHTML = spotlightMembers.map(member => `
        <article class="spotlight-card">
            <div class="spotlight-header">
                <h3>${member.name}</h3>
                <p class="tagline">${member.tagline}</p>
            </div>
            <div class="spotlight-body">
                <img src="${member.image}" alt="${member.name} logo" width="80" height="80">
                <div class="spotlight-info">
                    <p><strong>EMAIL:</strong> <a href="mailto:${member.email}">${member.email}</a></p>
                    <p><strong>PHONE:</strong> <a href="tel:${member.phone}">${member.phone}</a></p>
                    <p><strong>URL:</strong> <a href="https://${member.url}" target="_blank">${member.url}</a></p>
                </div>
            </div>
        </article>
    `).join('');
}

renderSpotlights();