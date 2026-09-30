import { Pill } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { MedicineCard } from "@/components/MedicineCard";
import { ListSkeleton, ErrorState } from "@/components/StateViews";
import { SearchBox } from "@/components/SearchBox";
import { useCatalog } from "@/hooks/useCatalog";
import { summarize } from "@/services/offers";

export default function HomePage() {
  const { medicines, offers, loading, error, retry } = useCatalog();

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    medicines.forEach((m) => counts.set(m.category, (counts.get(m.category) ?? 0) + 1));
    return [...counts.entries()];
  }, [medicines]);

  // «Популярные» — лекарства с наибольшим числом предложений
  const popular = useMemo(
    () => medicines.map((m) => summarize(m, offers)).sort((a, b) => b.offersCount - a.offersCount).slice(0, 4),
    [medicines, offers],
  );

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-primary/15 to-accent px-4 py-10 text-center sm:px-10">
        <Pill className="mx-auto mb-3 h-10 w-10 text-primary" aria-hidden />
        <h1 className="text-3xl font-bold sm:text-4xl">Найдите лекарство по лучшей цене</h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">Сравниваем цены и наличие в аптеках вашего города</p>
        <div className="mx-auto mt-6 max-w-2xl text-left"><SearchBox /></div>
      </section>

      {error && <ErrorState message={error} onRetry={retry} />}

      <section aria-labelledby="cats">
        <h2 id="cats" className="mb-3 text-xl font-semibold">Категории</h2>
        {loading ? <ListSkeleton rows={1} /> : (
          <ul className="flex flex-wrap gap-2">
            {categories.map(([name, n]) => (
              <li key={name}>
                <Link to={`/search?category=${encodeURIComponent(name)}`} className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-accent">
                  {name} <span className="text-muted-foreground">{n}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="pop">
        <h2 id="pop" className="mb-3 text-xl font-semibold">Популярные препараты</h2>
        {loading ? <ListSkeleton /> : (
          <div className="grid gap-3 md:grid-cols-2">{popular.map((p) => <MedicineCard key={p.medicine.id} item={p} />)}</div>
        )}
      </section>
    </div>
  );
}
