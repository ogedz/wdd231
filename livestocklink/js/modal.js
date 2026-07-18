// modal.js — shared modal open/close logic for the farm detail dialog.
// The Express Interest form inside the modal is a plain HTML form (method="get",
// action="thank-you.html"), so the browser handles validation and navigation —
// no submit handler needed here.
import { farmModalTemplate } from './render.js';

let lastFocusedEl = null;

export function initModalShell() {
  const backdrop = document.getElementById('modalBackdrop');
  if (!backdrop) return;

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

export function openFarmModal(farm) {
  const backdrop = document.getElementById('modalBackdrop');
  const panel = document.getElementById('modalPanel');
  if (!backdrop || !panel) return;

  lastFocusedEl = document.activeElement;

  panel.innerHTML = `
    <button class="modal-close" id="modalCloseBtn" aria-label="Close dialog">✕</button>
    ${farmModalTemplate(farm)}
  `;

  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);

  const interestForm = document.getElementById('expressInterestForm');
  interestForm.addEventListener('submit', () => {
    document.getElementById('interestTimestamp').value = new Date().toLocaleString('en-NG');
  });

  panel.querySelector('.modal-close').focus();
}

export function closeModal() {
  const backdrop = document.getElementById('modalBackdrop');
  if (!backdrop) return;
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedEl) lastFocusedEl.focus();
}
