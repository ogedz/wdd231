// theme.js — wires up the light/dark theme toggle button.
// The initial theme is already applied by an inline script in <head> to avoid a flash;
// this module just keeps the toggle button's icon/label in sync and handles clicks.

const STORAGE_KEY = 'livestocklink.theme';

function updateToggleUI(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isDark = theme === 'dark';
  btn.setAttribute('aria-pressed', String(isDark));
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
}

export function initTheme() {
  const root = document.documentElement;
  updateToggleUI(root.getAttribute('data-theme') || 'light');

  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    updateToggleUI(next);
  });
}
