const THEME_STORAGE_KEY = "docksteel_cinetcalc_theme";

/**
 * Obtém o tema atualmente salvo no localStorage ou o padrão 'dark'
 * @returns {'dark' | 'light'}
 */
export function getStoredTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || "dark";
}

/**
 * Aplica o tema ao elemento raiz HTML e salva no localStorage
 * @param {'dark' | 'light'} theme
 * @param {Function} [onThemeChange]
 */
export function applyTheme(theme, onThemeChange) {
  const htmlRoot = document.documentElement;
  if (theme === "light") {
    htmlRoot.setAttribute("data-theme", "light");
  } else {
    htmlRoot.removeAttribute("data-theme");
  }
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  if (typeof onThemeChange === "function") {
    onThemeChange(theme);
  }
}

/**
 * Alterna entre modo claro e escuro
 * @param {Function} [onThemeChange]
 */
export function toggleTheme(onThemeChange) {
  const htmlRoot = document.documentElement;
  const isLight = htmlRoot.getAttribute("data-theme") === "light";
  applyTheme(isLight ? "dark" : "light", onThemeChange);
}

/**
 * Inicializa os ouvintes e aplica o tema inicial
 * @param {HTMLElement} toggleButton
 * @param {Function} [onThemeChange]
 */
export function initTheme(toggleButton, onThemeChange) {
  if (toggleButton) {
    toggleButton.addEventListener("click", () => toggleTheme(onThemeChange));
  }
  const initialTheme = getStoredTheme();
  applyTheme(initialTheme, onThemeChange);
  return initialTheme;
}
