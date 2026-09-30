import { ExternalLink } from "lucide-react";
import { PHARMACY_SITES } from "@/lib/pharmacySites";

/** Кнопки «искать на сайте аптеки» — актуальные цены и наличие берутся с самих сайтов. */
export function ExternalSearch({ query }: { query: string }) {
  const q = query.trim();
  if (!q) return null;
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label={`Искать «${q}» в аптеках`}>
      {PHARMACY_SITES.map((s) => (
        <li key={s.name}>
          <a
            href={s.searchUrl(q)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full items-center justify-between gap-2 rounded-lg border bg-card p-4 font-medium shadow-sm transition-shadow hover:shadow-md"
          >
            <span>Искать в «{s.name}»</span>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="sr-only">(откроется в новой вкладке)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
