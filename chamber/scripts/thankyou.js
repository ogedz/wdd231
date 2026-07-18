// thankyou.js - Display submitted membership application data

const levelLabels = {
    np: 'NP Membership (No Fee)',
    bronze: 'Bronze Membership',
    silver: 'Silver Membership',
    gold: 'Gold Membership'
};

function displayConfirmation() {
    const params = new URLSearchParams(window.location.search);
    const detailsList = document.getElementById('confirmation-details');

    // Required fields, in display order
    const fields = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email Address' },
        { key: 'mobilePhone', label: 'Mobile Phone' },
        { key: 'businessName', label: 'Business/Organization' },
        { key: 'timestamp', label: 'Submitted' }
    ];

    if (![...params.keys()].length) {
        detailsList.innerHTML = '<p class="no-data">No application data was found. If you reached this page directly, please <a href="join.html">fill out the membership form</a>.</p>';
        return;
    }

    let html = '';

    fields.forEach(field => {
        const value = params.get(field.key);
        if (value) {
            html += `<dt>${field.label}</dt><dd>${value}</dd>`;
        }
    });

    const level = params.get('membershipLevel');
    if (level) {
        html += `<dt>Membership Level</dt><dd>${levelLabels[level] || level}</dd>`;
    }

    detailsList.innerHTML = html;
}

displayConfirmation();