import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface AppState {
  theme: Theme;
  /** Последние поисковые запросы (новые — первыми) */
  history: string[];
  /** Сохранённые запросы */
  favorites: string[];

  toggleTheme: () => void;
  addHistory: (q: string) => void;
  removeHistory: (q: string) => void;
  clearHistory: () => void;
  toggleFavorite: (q: string) => void;
}

const systemTheme = (): Theme =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: systemTheme(),
      history: [],
      favorites: [],

      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      addHistory: (q) => {
        const query = q.trim();
        if (query.length < 2) return;
        // дубликаты поднимаем наверх, храним последние 8
        set((s) => ({ history: [query, ...s.history.filter((h) => !same(h, query))].slice(0, 8) }));
      },
      removeHistory: (q) => set((s) => ({ history: s.history.filter((h) => h !== q) })),
      clearHistory: () => set({ history: [] }),
      toggleFavorite: (q) =>
        set((s) => ({
          favorites: s.favorites.some((f) => same(f, q)) ? s.favorites.filter((f) => !same(f, q)) : [...s.favorites, q.trim()],
        })),
    }),
    {
      name: "pharmacy-finder",
      version: 2,
      // v1 хранила id лекарств из демо-каталога — их переносить нельзя, оставляем только тему и историю
      migrate: (old, version) => {
        const s = (old ?? {}) as Partial<AppState>;
        return version < 2 ? { theme: s.theme ?? systemTheme(), history: s.history ?? [], favorites: [] } : (s as AppState);
      },
      partialize: (s) => ({ theme: s.theme, history: s.history, favorites: s.favorites }),
    },
  ),
);
