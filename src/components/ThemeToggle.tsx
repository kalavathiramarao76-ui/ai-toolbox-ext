import React, { useState, useEffect, useCallback } from "react";

export type ThemeMode = "dark" | "light" | "system";

const THEME_STORAGE_KEY = "ai_toolbox_theme_mode";

function getSystemPreference(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode): void {
  const resolved = mode === "system" ? getSystemPreference() : mode;
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(resolved);
  root.setAttribute("data-theme", resolved);
}

function loadThemeMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (stored && ["dark", "light", "system"].includes(stored)) return stored;
  } catch {}
  return "dark";
}

function saveThemeMode(mode: ThemeMode): void {
  localStorage.setItem(THEME_STORAGE_KEY, mode);
  // Also persist to chrome.storage for cross-context sync
  try {
    chrome.storage?.local?.set({ [THEME_STORAGE_KEY]: mode });
  } catch {}
}

// Icons
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SystemIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const MODES: { mode: ThemeMode; Icon: React.FC; label: string }[] = [
  { mode: "light", Icon: SunIcon, label: "Light" },
  { mode: "dark", Icon: MoonIcon, label: "Dark" },
  { mode: "system", Icon: SystemIcon, label: "System" },
];

export const ThemeToggle: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>(loadThemeMode);

  const cycleTheme = useCallback(() => {
    setMode((prev) => {
      const order: ThemeMode[] = ["dark", "light", "system"];
      const next = order[(order.indexOf(prev) + 1) % order.length];
      saveThemeMode(next);
      applyTheme(next);
      return next;
    });
  }, []);

  // Apply on mount and listen for system preference changes
  useEffect(() => {
    applyTheme(mode);

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (mode === "system") applyTheme("system");
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [mode]);

  // Listen for chrome.storage changes from other contexts
  useEffect(() => {
    try {
      const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
        if (changes[THEME_STORAGE_KEY]) {
          const newMode = changes[THEME_STORAGE_KEY].newValue as ThemeMode;
          setMode(newMode);
          applyTheme(newMode);
        }
      };
      chrome.storage?.onChanged?.addListener(listener);
      return () => chrome.storage?.onChanged?.removeListener(listener);
    } catch {}
  }, []);

  const current = MODES.find((m) => m.mode === mode)!;

  return (
    <button
      onClick={cycleTheme}
      className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors text-sm"
      title={`Theme: ${current.label}`}
    >
      <current.Icon />
    </button>
  );
};

// Export for FOUC prevention script
export { applyTheme, loadThemeMode };
