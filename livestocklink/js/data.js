// data.js — fetches and caches the farm directory from the JSON data file.

const DATA_URL = 'data/farms.json';
let cache = null;

export async function getFarms() {
  if (cache) return cache;
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Could not load farm directory (status ${response.status})`);
  }
  cache = await response.json();
  return cache;
}

export async function getFarmById(id) {
  const farms = await getFarms();
  return farms.find((farm) => farm.id === id) || null;
}

export function getAllStates(farms) {
  return [...new Set(farms.map((farm) => farm.state))].sort();
}

export function getAllLivestockTypes(farms) {
  const types = farms.flatMap((farm) => farm.livestockTypes);
  return [...new Set(types)].sort();
}

export function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`;
}
