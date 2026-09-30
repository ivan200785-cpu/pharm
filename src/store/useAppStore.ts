import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Coordinates, PriceAlert } from "@/types";

type Theme = "light" | "dark";

interface AppState {
  theme: Theme;
  history: string[];
  favorites: string[];
  alerts: PriceAlert[];
  /** id лекарств, о снижении цены которых пользователь уже уведомлён */
  seenAlerts: string[];
  profile: { name: string; city: string };
  location: Coordinates | null; // не сохраняем в localStorage

  toggleTheme: () => void;
  addHistory: (q: string) => void;
  removeHistory: (q: string) => void;
  clearHistory: () => void;
  toggleFavorite: (id: string) => void;
  setAlert: (alert: PriceAlert) => void;
  removeAlert: (medicineId: string) => void;
  markAlertSeen: (medicineId: string) => void;
  updateProfile: (p: Partial<AppState["profile"]>) => void;
  setLocation: (c: Coordinates | null) => void;
}

const systemTheme = (): Theme =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: systemTheme(),
      history: [],
      favorites: [],
      alerts: [],
      seenAlerts: [],
      profile: { name: "", city: "Москва" },
      location: null,

      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      addHistory: (q) => {
        const query = q.trim();
        if (query.length < 2) return;
        // дубликаты поднимаем наверх, храним последние 8
        set((s) => ({ history: [query, ...s.history.filter((h) => h.toLowerCase() !== query.toLowerCase())].slice(0, 8) }));
      },
      removeHistory: (q) => set((s) => ({ history: s.history.filter((h) => h !== q) })),
      clearHistory: () => set({ history: [] }),
      toggleFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] })),
      setAlert: (alert) =>
        set((s) => ({
          alerts: [...s.alerts.filter((a) => a.medicineId !== alert.medicineId), alert],
          seenAlerts: s.seenAlerts.filter((id) => id !== alert.medicineId),
        })),
      removeAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.medicineId !== id) })),
      markAlertSeen: (id) => set((s) => ({ seenAlerts: s.seenAlerts.includes(id) ? s.seenAlerts : [...s.seenAlerts, id] })),
      updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setLocation: (location) => set({ location }),
    }),
    {
      name: "pharmacy-finder",
      partialize: (s) => ({
        theme: s.theme, history: s.history, favorites: s.favorites,
        alerts: s.alerts, seenAlerts: s.seenAlerts, profile: s.profile,
      }),
    },
  ),
);
