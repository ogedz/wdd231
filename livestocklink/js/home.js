// home.js — populates the landing page: stats strip, ticker, and featured listings.
import { getFarms, getAllStates, getAllLivestockTypes, formatNaira } from './data.js';
import { farmCardTemplate } from './render.js';
import { toggleFavorite } from './storage.js';
import { openFarmModal, initModalShell } from './modal.js';
import { initNav } from './nav.js';
import { initTheme } from './theme.js';

initNav();
initModalShell();
initTheme();

async function init() {
  try {
    const farms = await getFarms();
    renderStats(farms);
    renderTicker(farms);
    renderFeatured(farms);
    wireCardEvents(farms);
  } catch (err) {
    document.getElementById('featuredGrid').innerHTML =
      `<p role="alert">We couldn't load the farm directory right now. Please refresh the page. (${err.message})</p>`;
  }
}

function renderStats(farms) {
  const states = getAllStates(farms);
  const types = getAllLivestockTypes(farms);
  const verifiedCount = farms.filter((f) => f.verified).length;

  const stats = [
    { num: farms.length, label: 'Active farm listings' },
    { num: states.length, label: 'States represented' },
    { num: types.length, label: 'Livestock categories' },
    { num: verifiedCount, label: 'Verified farm profiles' },
  ];

  document.getElementById('statsGrid').innerHTML = stats
    .map((s) => `<div class="stat-card"><span class="num">${s.num}</span><span class="label">${s.label}</span></div>`)
    .join('');
}

function renderTicker(farms) {
  const items = farms
    .slice(0, 10)
    .map((f) => `<span>${f.farmName} <span class="big">${formatNaira(f.pricePerUnit)}</span> / ${f.unit.replace(/s$/, '')}</span>`);
  const looped = [...items, ...items].join('');
  document.getElementById('tickerTrack').innerHTML = looped;
}

function renderFeatured(farms) {
  const featured = farms.filter((f) => f.verified).slice(0, 6);
  const list = featured.length ? featured : farms.slice(0, 6);
  document.getElementById('featuredGrid').innerHTML = list.map(farmCardTemplate).join('');
}

function wireCardEvents(farms) {
  const grid = document.getElementById('featuredGrid');
  grid.addEventListener('click', (event) => {
    const viewBtn = event.target.closest('.view-details-btn');
    const favBtn = event.target.closest('.favorite-btn');

    if (viewBtn) {
      const farm = farms.find((f) => f.id === viewBtn.dataset.farmId);
      if (farm) openFarmModal(farm);
    }

    if (favBtn) {
      const nowFav = toggleFavorite(favBtn.dataset.farmId);
      favBtn.setAttribute('aria-pressed', String(nowFav));
      favBtn.textContent = nowFav ? '★' : '☆';
      favBtn.title = nowFav ? 'Remove from saved farms' : 'Save this farm';
      favBtn.setAttribute('aria-label', favBtn.title);
    }
  });
}

init();
