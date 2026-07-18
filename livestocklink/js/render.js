// render.js — builds DOM markup for farm cards and the detail modal.
import { formatNaira } from './data.js';
import { isFavorite } from './storage.js';

export function farmCardTemplate(farm) {
  const verifiedPill = farm.verified
    ? `<span class="pill verified">✓ Verified farm</span>`
    : '';
  const typePills = farm.livestockTypes
    .map((t) => `<span class="pill">${t}</span>`)
    .join('');
  const varietyPills = (farm.varieties || [])
    .slice(0, 3)
    .map((v) => `<span class="pill variety">${v}</span>`)
    .join('');
  const fav = isFavorite(farm.id);

  return `
    <article class="farm-card" data-farm-id="${farm.id}">
      <div class="farm-card-top">
        <img class="icon-badge" src="${farm.image}" alt="" width="40" height="40" loading="lazy">
        <div class="who">
          <div class="farm-name">${farm.farmName}</div>
          <div class="farm-loc">${farm.town}, ${farm.state} State</div>
        </div>
      </div>
      <div class="farm-card-body">
        <p class="tagline">${farm.tagline}</p>
        <div class="farm-tags">${typePills}${verifiedPill}</div>
        <div class="farm-tags">${varietyPills}</div>
        <dl class="farm-meta">
          <div><dt>Quantity available</dt><dd>${farm.quantity.toLocaleString('en-NG')} ${farm.unit}</dd></div>
          <div><dt>Price per unit</dt><dd class="price">${formatNaira(farm.pricePerUnit)}</dd></div>
        </dl>
        <p class="desc">${farm.description}</p>
        <div class="farm-card-actions">
          <button class="btn btn-primary btn-sm view-details-btn" data-farm-id="${farm.id}">View details</button>
          <button
            class="fav-btn favorite-btn"
            data-farm-id="${farm.id}"
            aria-pressed="${fav}"
            aria-label="${fav ? 'Remove from saved farms' : 'Save this farm'}"
            title="${fav ? 'Remove from saved farms' : 'Save this farm'}"
          >${fav ? '★' : '☆'}</button>
        </div>
      </div>
    </article>
  `;
}

export function farmModalTemplate(farm) {
  const typePills = farm.livestockTypes.map((t) => `<span class="pill">${t}</span>`).join('');
  const varietyPills = (farm.varieties || []).map((v) => `<span class="pill variety">${v}</span>`).join('');
  const websiteHost = farm.website.replace(/^https?:\/\//, '');

  return `
    <div class="modal-header">
      <img class="icon-badge" src="${farm.image}" alt="" width="46" height="46" loading="lazy">
      <div>
        <h3 style="margin:0;">${farm.farmName}</h3>
        <div style="font-family:var(--mono); font-size:0.8rem; color:var(--gold-soft);">${farm.town}, ${farm.state} State</div>
      </div>
    </div>
    <div class="modal-body">
      <p class="tagline" style="margin-top:-4px;">${farm.tagline}</p>
      <div class="farm-tags">${typePills}${farm.verified ? '<span class="pill verified">✓ Verified farm</span>' : ''}</div>
      <div class="farm-tags" style="margin-top:8px;">${varietyPills}</div>

      <h4>Listing details</h4>
      <div class="modal-meta-grid">
        <div class="item"><div class="k">Quantity</div><div class="v">${farm.quantity.toLocaleString('en-NG')} ${farm.unit}</div></div>
        <div class="item price"><div class="k">Price per unit</div><div class="v">${formatNaira(farm.pricePerUnit)}</div></div>
        <div class="item"><div class="k">Phone</div><div class="v">${farm.phone}</div></div>
        <div class="item"><div class="k">Website</div><div class="v" style="font-size:0.85rem;"><a href="${farm.website}" target="_blank" rel="noopener">${websiteHost}</a></div></div>
      </div>

      <h4>About the farm</h4>
      <p>${farm.description}</p>

      <h4>Owner profile — ${farm.ownerName}</h4>
      <p>${farm.bio}</p>

      <h4>Express interest</h4>
      <form class="express-form" id="expressInterestForm" action="thank-you.html" method="get">
        <input type="hidden" name="type" value="interest">
        <input type="hidden" name="farmId" value="${farm.id}">
        <input type="hidden" name="farmName" value="${farm.farmName}">
        <input type="hidden" name="farmLocation" value="${farm.town}, ${farm.state} State">
        <input type="hidden" name="pricePerUnit" value="${formatNaira(farm.pricePerUnit)}">
        <input type="hidden" name="timestamp" id="interestTimestamp">
        <div class="two-col">
          <div class="form-row">
            <label for="buyerName">Your name</label>
            <input type="text" id="buyerName" name="buyerName" required minlength="2" title="Enter your full name" autocomplete="name">
          </div>
          <div class="form-row">
            <label for="buyerPhone">Your phone number</label>
            <input type="tel" id="buyerPhone" name="buyerPhone" required pattern="^[0-9+\\s-]{7,15}$" title="Enter a valid phone number (7–15 digits)" autocomplete="tel">
          </div>
        </div>
        <div class="form-row">
          <label for="buyerQuantity">Quantity you're interested in</label>
          <input type="number" id="buyerQuantity" name="buyerQuantity" min="1" required title="Enter the quantity you'd like to buy" placeholder="e.g. 50">
        </div>
        <div class="form-row">
          <label for="buyerMessage">Message to the farmer (optional)</label>
          <textarea id="buyerMessage" name="buyerMessage" placeholder="Tell the farm about your order, delivery needs, or timeline"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Send interest</button>
      </form>
    </div>
  `;
}
