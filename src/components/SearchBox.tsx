import { Clock, Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

/**
 * Поле поиска (ARIA combobox/listbox) с подсказками из истории запросов.
 * Каталога лекарств в приложении нет: по Enter открывается страница со ссылками на поиск в аптеках.
 */
export function SearchBox({ initial = "", autoFocus = false }: { initial?: string; autoFocus?: boolean }) {
  const navigate = useNavigate();
  const history = useAppStore((s) => s.history);
  const addHistory = useAppStore((s) => s.addHistory);
  const removeHistory = useAppStore((s) => s.removeHistory);
  const clearHistory = useAppStore((s) => s.clearHistory);

  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setValue(initial), [initial]);

  const options = useMemo(() => {
    const q = value.trim().toLowerCase();
    return q ? history.filter((h) => h.toLowerCase().includes(q) && h.toLowerCase() !== q) : history;
  }, [value, history]);

  // Закрываем список по клику вне компонента
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const submit = (q: string) => {
    const query = q.trim();
    if (!query) return;
    addHistory(query);
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => (a + 1) % Math.max(options.length, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a <= 0 ? options.length - 1 : a - 1)); }
    else if (e.key === "Escape") setOpen(false);
    else if (e.key === "Enter") {
      e.preventDefault();
      if (open && active >= 0 && options[active]) { setValue(options[active]); submit(options[active]); }
      else submit(value);
    }
  };

  const showList = open && options.length > 0;

  return (
    <div ref={rootRef} className="relative w-full">
      <form role="search" onSubmit={(e) => { e.preventDefault(); submit(value); }}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          role="combobox"
          aria-label="Поиск лекарства"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoFocus={autoFocus}
          autoComplete="off"
          placeholder="Название лекарства, например: Артра"
          value={value}
          onChange={(e) => { setValue(e.target.value); setActive(-1); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-12 w-full rounded-lg border border-input bg-card pl-11 pr-24 text-base shadow-sm placeholder:text-muted-foreground"
        />
        {value && (
          <button type="button" aria-label="Очистить поиск" onClick={() => setValue("")} className="absolute right-[4.5rem] top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
        <button type="submit" className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Найти
        </button>
      </form>

      {showList && (
        <ul id={listId} role="listbox" aria-label="История запросов" className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-lg border bg-card p-1 shadow-lg">
          <li role="presentation" className="flex items-center justify-between px-3 py-1 text-xs text-muted-foreground">
            Недавние запросы
            <button type="button" onClick={clearHistory} className="underline hover:text-foreground">Очистить</button>
          </li>
          {options.map((o, i) => (
            <li
              key={o}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { setValue(o); submit(o); }}
              className={cn("flex cursor-pointer items-center gap-3 rounded-md px-3 py-2", i === active && "bg-accent")}
            >
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="min-w-0 flex-1 truncate font-medium">{o}</span>
              <button type="button" aria-label={`Удалить «${o}» из истории`} onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); removeHistory(o); }} className="rounded p-1 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
