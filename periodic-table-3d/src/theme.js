/**
 * One persisted colour-mode controller shared by all four entry points.
 * No OS-only switching after the user explicitly chooses a theme.
 */
const STORAGE_KEY = 'atomic-atlas-theme';
export function getTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (_) {}
  return 'dark'; // Default to the vivid neon night palette; retain explicit saved choices.
}
export function setTheme(mode) {
  document.documentElement.dataset.theme = mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#080c1d' : '#eef4ff');
  try { localStorage.setItem(STORAGE_KEY, mode); } catch (_) {}
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.setAttribute('aria-label', mode === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối');
    button.setAttribute('title', mode === 'dark' ? 'Chế độ sáng' : 'Chế độ tối');
    button.setAttribute('aria-pressed', String(mode === 'dark'));
  });
  document.dispatchEvent(new CustomEvent('atomic-theme-change', { detail:{ mode } }));
}
export function initTheme() {
  setTheme(getTheme());
  document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => setTheme(getTheme()==='dark'?'light':'dark')));
}
