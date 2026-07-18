// join.js - Membership form timestamp + modal handling

// Stamp the hidden timestamp field with the moment the form was loaded
(function() {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    }
})();

// Wire up membership card "Learn More" links to open their matching dialog
(function() {
    document.querySelectorAll('.modal-link').forEach(link => {
        link.addEventListener('click', () => {
            const modal = document.getElementById(link.dataset.modalTarget);
            if (modal) modal.showModal();
        });
    });

    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.getElementById(button.dataset.modalClose);
            if (modal) modal.close();
        });
    });

    // Close a dialog when the backdrop is clicked
    document.querySelectorAll('.membership-modal').forEach(modal => {
        modal.addEventListener('click', event => {
            const box = modal.getBoundingClientRect();
            const clickedInside = event.clientX >= box.left && event.clientX <= box.right &&
                                   event.clientY >= box.top && event.clientY <= box.bottom;
            if (!clickedInside) modal.close();
        });
    });
})();