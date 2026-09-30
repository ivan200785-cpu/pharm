import { createContext, useContext, useMemo, type ReactNode } from "react";
import { api } from "@/services/api";
import { createSearchIndex, type SearchIndex } from "@/services/search";
import type { Medicine, Pharmacy, PharmacyOffer } from "@/types";
import { useAsync } from "./useAsync";

interface Catalog {
  medicines: Medicine[];
  pharmacies: Pharmacy[];
  offers: PharmacyOffer[];
  index: SearchIndex;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

const CatalogContext = createContext<Catalog | null>(null);

/** Каталог грузится один раз на всё приложение и раздаётся через контекст. */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const { data, loading, error, retry } = useAsync(
    () => Promise.all([api.getMedicines(), api.getPharmacies(), api.getOffers()]),
    [],
  );
  const value = useMemo<Catalog>(() => {
    const medicines = data?.[0] ?? [];
    return {
      medicines,
      pharmacies: data?.[1] ?? [],
      offers: data?.[2] ?? [],
      index: createSearchIndex(medicines),
      loading, error, retry,
    };
  }, [data, loading, error, retry]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): Catalog {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog должен использоваться внутри CatalogProvider");
  return ctx;
}
