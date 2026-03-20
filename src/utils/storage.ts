export interface FavoriteItem {
  id: string;
  tool: string;
  title: string;
  content: string;
  timestamp: number;
}

const FAVORITES_KEY = "ai_toolbox_favorites";
const THEME_KEY = "ai_toolbox_theme";

export function getFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addFavorite(item: Omit<FavoriteItem, "id" | "timestamp">): void {
  const favorites = getFavorites();
  favorites.unshift({
    ...item,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  });
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.slice(0, 50)));
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function getTheme(): "dark" | "light" {
  return (localStorage.getItem(THEME_KEY) as "dark" | "light") || "dark";
}

export function setTheme(theme: "dark" | "light"): void {
  localStorage.setItem(THEME_KEY, theme);
}
