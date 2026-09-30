import { ExternalLink } from "lucide-react";
import { PHARMACY_SITES } from "@/lib/pharmacySites";

/** Кнопки «искать на сайте аптеки» — реальные цены и наличие берутся с самих сайтов. */
export function ExternalSearch({ query, title = "Реальные цены и наличие — на сайтах аптек" }: { query: string; title?: string }) {
  const q = query.trim();
  if (!q) return null;
  return (
    <section aria-label="Поиск на сайтах аптек" className="rounded-lg border bg-accent/40 p-4">
      <h2 className="mb-1 text-sm font-semibold">{title}</h2>
      <p className="mb-3 text-xs text-muted-foreground">
        Каталог в этом приложении демонстрационный. Искать «{q}» по-настоящему можно на сайтах аптек (откроется в новой вкладке):
      </p>
      <ul className="flex flex-wrap gap-2">
        {PHARMACY_SITES.map((s) => (
          <li key={s.name}>
            <a
              href={s.searchUrl(q)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent"
            >
              {s.name} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">(откроется в новой вкладке)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
