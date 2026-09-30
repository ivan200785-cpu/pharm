import Fuse from "fuse.js";
import type { Medicine } from "@/types";

/** Fuse.js даёт нечёткий поиск: «парацетомол» найдёт «Парацетамол». */
export function createSearchIndex(medicines: Medicine[]) {
  return new Fuse(medicines, {
    keys: [
      { name: "name", weight: 0.5 },
      { name: "activeSubstance", weight: 0.3 },
      { name: "manufacturer", weight: 0.1 },
      { name: "category", weight: 0.1 },
    ],
    threshold: 0.38, // чем ниже — тем строже
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}

export type SearchIndex = ReturnType<typeof createSearchIndex>;

export const searchMedicines = (index: SearchIndex, query: string, limit?: number): Medicine[] => {
  const q = query.trim();
  if (!q) return [];
  return index.search(q, limit ? { limit } : undefined).map((r) => r.item);
};
