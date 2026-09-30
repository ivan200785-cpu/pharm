import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MedicineCard } from "@/components/MedicineCard";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/StateViews";
import { ExternalSearch } from "@/components/ExternalSearch";
import { SearchBox } from "@/components/SearchBox";
import { useCatalog } from "@/hooks/useCatalog";
import { summarize } from "@/services/offers";
import { searchMedicines } from "@/services/search";

type Order = "relevance" | "price-asc" | "price-desc";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category");
  const { medicines, offers, index, loading, error, retry } = useCatalog();
  const [order, setOrder] = useState<Order>("relevance");

  const results = useMemo(() => {
    let list = q ? searchMedicines(index, q) : medicines;
    if (category) list = list.filter((m) => m.category === category);
    const items = list.map((m) => summarize(m, offers));
    if (order === "price-asc") items.sort((a, b) => (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity));
    if (order === "price-desc") items.sort((a, b) => (b.minPrice ?? -1) - (a.minPrice ?? -1));
    return items;
  }, [q, category, medicines, offers, index, order]);

  return (
    <div className="space-y-5">
      <SearchBox initial={q} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold" aria-live="polite">
          {category ? `Категория: ${category}` : q ? `Результаты по запросу «${q}»` : "Все лекарства"}
          {!loading && <span className="ml-2 text-base font-normal text-muted-foreground">({results.length})</span>}
        </h1>
        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium">Сортировка</span>
          <select value={order} onChange={(e) => setOrder(e.target.value as Order)} className="h-10 rounded-md border border-input bg-card px-3 text-sm">
            <option value="relevance">По релевантности</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
          </select>
        </label>
      </div>

      {!category && <ExternalSearch query={q} />}

      {error ? <ErrorState message={error} onRetry={retry} />
        : loading ? <ListSkeleton />
        : results.length === 0 ? <EmptyState title="В демо-каталоге ничего не найдено" hint="Проверьте написание или поищите на сайтах аптек ниже" />
        : <div className="grid gap-3 lg:grid-cols-2">{results.map((r) => <MedicineCard key={r.medicine.id} item={r} />)}</div>}
    </div>
  );
}
