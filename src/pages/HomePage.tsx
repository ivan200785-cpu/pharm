import { Pill } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchBox } from "@/components/SearchBox";
import { PHARMACY_SITES } from "@/lib/pharmacySites";
import { useAppStore } from "@/store/useAppStore";

export default function HomePage() {
  const history = useAppStore((s) => s.history);
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-primary/15 to-accent px-4 py-10 text-center sm:px-10">
        <Pill className="mx-auto mb-3 h-10 w-10 text-primary" aria-hidden />
        <h1 className="text-3xl font-bold sm:text-4xl">Найдите лекарство в аптеках</h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Введите название — откроем поиск сразу на сайтах аптек: {PHARMACY_SITES.map((s) => s.name).join(", ")}
        </p>
        <div className="mx-auto mt-6 max-w-2xl text-left"><SearchBox /></div>
      </section>

      {history.length > 0 && (
        <section aria-labelledby="recent">
          <h2 id="recent" className="mb-3 text-xl font-semibold">Недавние запросы</h2>
          <ul className="flex flex-wrap gap-2">
            {history.map((h) => (
              <li key={h}>
                <Link to={`/search?q=${encodeURIComponent(h)}`} className="inline-flex rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-accent">{h}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
