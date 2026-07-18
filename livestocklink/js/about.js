// about.js — wires up the small-screen nav, theme toggle, and a submit timestamp
// for the farmer registration form. The form itself submits natively (method="get"),
// so the browser handles validation and the query string; thank-you.js reads it back.
import { initNav } from './nav.js';
import { initTheme } from './theme.js';

initNav();
initTheme();

const form = document.getElementById('registrationForm');
const timestampField = document.getElementById('regTimestamp');

form.addEventListener('submit', () => {
  timestampField.value = new Date().toLocaleString('en-NG');
});
