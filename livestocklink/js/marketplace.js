// marketplace.js — dynamic State + Livestock Type filtering over the farm directory.
import { getFarms, getAllStates, getAllLivestockTypes } from './data.js';
import { farmCardTemplate } from './render.js';
import { toggleFavorite, getFavorites } from './storage.js';
import { openFarmModal, initModalShell } from './modal.js';
import { initNav } from './nav.js';
import { initTheme } from './theme.js';

initNav();
initModalShell();
initTheme();

let allFarms = [];
let showSavedOnly = false;

const grid = document.getElementById('marketplaceGrid');
const stateSelect = document.getElementById('stateFilter');
const typeSelect = document.getElementById('typeFilter');
const resetBtn = document.getElementById('resetFilters');
const savedToggleBtn = document.getElementById('savedToggle');
const resultsCount = document.getElementById('resultsCount');

async function init() {
  try {
    allFarms = await getFarms();
    populateFilterOptions(allFarms);
    render();
  } catch (err) {
    grid.innerHTML = `<p role="alert">We couldn't load the farm directory right now. Please refresh the page. (${err.message})</p>`;
  }
}

function populateFilterOptions(farms) {
  const states = getAllStates(farms);
  const types = getAllLivestockTypes(farms);

  stateSelect.innerHTML =
    '<option value="">All states</option>' +
    states.map((s) => `<option value="${s}">${s}</option>`).join('');

  typeSelect.innerHTML =
    '<option value="">All livestock types</option>' +
    types.map((t) => `<option value="${t}">${t}</option>`).join('');
}

function getFilteredFarms() {
  const stateVal = stateSelect.value;
  const typeVal = typeSelect.value;
  const savedIds = getFavorites();

  return allFarms.filter((farm) => {
    const matchesState = !stateVal || farm.state === stateVal;
    const matchesType = !typeVal || farm.livestockTypes.includes(typeVal);
    const matchesSaved = !showSavedOnly || savedIds.includes(farm.id);
    return matchesState && matchesType && matchesSaved;
  });
}

function render() {
  const filtered = getFilteredFarms();

  resultsCount.innerHTML = `Showing <strong>${filtered.length}</strong> of ${allFarms.length} farm listing${allFarms.length === 1 ? '' : 's'}`;

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No farms match those filters</h3>
        <p>Try a different state or livestock type, or reset your filters.</p>
        <button class="btn btn-outline" id="emptyResetBtn">Reset filters</button>
      </div>`;
    document.getElementById('emptyResetBtn').addEventListener('click', resetFilters);
    return;
  }

  grid.innerHTML = filtered.map(farmCardTemplate).join('');
}

function resetFilters() {
  stateSelect.value = '';
  typeSelect.value = '';
  showSavedOnly = false;
  savedToggleBtn.setAttribute('aria-pressed', 'false');
  savedToggleBtn.textContent = `♡ Saved farms (${getFavorites().length})`;
  render();
}

stateSelect.addEventListener('change', render);
typeSelect.addEventListener('change', render);
resetBtn.addEventListener('click', resetFilters);

savedToggleBtn.addEventListener('click', () => {
  showSavedOnly = !showSavedOnly;
  savedToggleBtn.setAttribute('aria-pressed', String(showSavedOnly));
  render();
});

grid.addEventListener('click', (event) => {
  const viewBtn = event.target.closest('.view-details-btn');
  const favBtn = event.target.closest('.favorite-btn');

  if (viewBtn) {
    const farm = allFarms.find((f) => f.id === viewBtn.dataset.farmId);
    if (farm) openFarmModal(farm);
  }

  if (favBtn) {
    const nowFav = toggleFavorite(favBtn.dataset.farmId);
    favBtn.setAttribute('aria-pressed', String(nowFav));
    favBtn.textContent = nowFav ? '★' : '☆';
    favBtn.title = nowFav ? 'Remove from saved farms' : 'Save this farm';
    favBtn.setAttribute('aria-label', favBtn.title);
    savedToggleBtn.textContent = `${showSavedOnly ? '♥' : '♡'} Saved farms (${getFavorites().length})`;
    if (showSavedOnly) render();
  }
});

savedToggleBtn.textContent = `♡ Saved farms (${getFavorites().length})`;

init();
