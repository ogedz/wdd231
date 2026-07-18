// storage.js — wraps localStorage for the "saved / favorite farms" feature.
// This is the site's Local Storage usage: it persists a user's saved-farm
// state across page loads and browser sessions.

const FAVORITES_KEY = 'livestocklink.favorites';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(farmId) {
  return getFavorites().includes(farmId);
}

export function toggleFavorite(farmId) {
  const current = getFavorites();
  const index = current.indexOf(farmId);
  if (index === -1) {
    current.push(farmId);
  } else {
    current.splice(index, 1);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(current));
  return current.includes(farmId);
}

export function favoritesCount() {
  return getFavorites().length;
}
