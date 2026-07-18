// thank-you.js — form action page. Reads the submitted form fields straight from
// the URL query string (URLSearchParams), since both forms on the site submit
// with method="get". No storage of any kind is involved in getting data here.
import { initNav } from './nav.js';
import { initTheme } from './theme.js';

initNav();
initTheme();

const params = new URLSearchParams(window.location.search);
const type = params.get('type');
const titleEl = document.getElementById('confirmTitle');
const ledeEl = document.getElementById('confirmLede');
const container = document.getElementById('confirmContent');

const INTEREST_FIELDS = [
  ['farmName', 'Farm'],
  ['farmLocation', 'Location'],
  ['pricePerUnit', 'Price per unit'],
  ['buyerName', 'Your name'],
  ['buyerPhone', 'Your phone'],
  ['buyerQuantity', 'Quantity wanted'],
  ['buyerMessage', 'Message'],
  ['timestamp', 'Submitted'],
];

const REGISTRATION_FIELDS = [
  ['farmerName', 'Farmer name'],
  ['farmName', 'Farm name'],
  ['farmState', 'State'],
  ['farmTown', 'Town / LGA'],
  ['farmerPhone', 'Phone'],
  ['livestockTypes', 'Livestock types'],
  ['farmDescription', 'Farm description'],
  ['timestamp', 'Submitted'],
];

function renderReceipt(fields) {
  const rows = fields
    .map(([key, label]) => {
      const value = params.get(key);
      return value ? `<dt>${label}</dt><dd>${value}</dd>` : '';
    })
    .join('');
  container.innerHTML = `<dl>${rows}</dl>`;
}

function showNoData() {
  titleEl.textContent = 'No recent submission found';
  ledeEl.textContent =
    "We couldn't find any submitted form data in the page URL. Submit the Express Interest or Farmer Registration form to see a receipt here.";
  container.innerHTML = '';
}

if (type === 'interest' && [...params.keys()].length > 1) {
  titleEl.textContent = 'Interest sent to the farm';
  ledeEl.textContent = `${params.get('farmName') || 'The farm'} has received your details and will reach out directly.`;
  renderReceipt(INTEREST_FIELDS);
} else if (type === 'registration' && [...params.keys()].length > 1) {
  titleEl.textContent = 'Registration received';
  ledeEl.textContent = `Thanks, ${params.get('farmerName') || 'friend'}. The LivestockLink team will review ${params.get('farmName') || 'your farm'} and follow up by phone to complete your listing.`;
  renderReceipt(REGISTRATION_FIELDS);
} else {
  showNoData();
}
