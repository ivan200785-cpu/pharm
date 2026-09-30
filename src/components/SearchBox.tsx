import { Clock, Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCatalog } from "@/hooks/useCatalog";
import { useDebounce } from "@/hooks/useDebounce";
import { searchMedicines } from "@/services/search";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface Option { kind: "history" | "medicine"; label: string; sub?: string; medicineId?: string }

/**
 * Поле поиска с автодополнением (ARIA combobox/listbox).
 * Пока поле пустое — показываем историю; иначе — fuzzy-подсказки (debounce 300 мс).
 */
export function SearchBox({ initial = "", autoFocus = false }: { initial?: string; autoFocus?: boolean }) {
  const navigate = useNavigate();
  const { index } = useCatalog();
  const history = useAppStore((s) => s.history);
  const addHistory = useAppStore((s) => s.addHistory);
  const removeHistory = useAppStore((s) => s.removeHistory);
  const clearHistory = useAppStore((s) => s.clearHistory);

  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounce(value, 300);
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setValue(initial), [initial]);

  const options = useMemo<Option[]>(() => {
    if (!value.trim()) return history.map((h) => ({ kind: "history", label: h }));
    return searchMedicines(index, debounced, 6).map((m) => ({
      kind: "medicine", label: m.name, sub: `${m.activeSubstance} · ${m.dosage} · ${m.manufacturer}`, medicineId: m.id,
    }));
  }, [value, debounced, history, index]);

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

  const choose = (o: Option) => {
    if (o.kind === "medicine" && o.medicineId) {
      addHistory(o.label);
      setOpen(false);
      navigate(`/medicine/${o.medicineId}`);
    } else {
      setValue(o.label);
      submit(o.label);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => (a + 1) % Math.max(options.length, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a <= 0 ? options.length - 1 : a - 1)); }
    else if (e.key === "Escape") setOpen(false);
    else if (e.key === "Enter") {
      e.preventDefault();
      if (open && active >= 0 && options[active]) choose(options[active]);
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
          placeholder="Название, действующее вещество или производитель"
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
        <ul id={listId} role="listbox" aria-label={value.trim() ? "Подсказки" : "История запросов"} className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-lg border bg-card p-1 shadow-lg">
          {!value.trim() && (
            <li role="presentation" className="flex items-center justify-between px-3 py-1 text-xs text-muted-foreground">
              Недавние запросы
              <button type="button" onClick={clearHistory} className="underline hover:text-foreground">Очистить</button>
            </li>
          )}
          {options.map((o, i) => (
            <li
              key={`${o.kind}-${o.label}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(o)}
              className={cn("flex cursor-pointer items-center gap-3 rounded-md px-3 py-2", i === active && "bg-accent")}
            >
              {o.kind === "history" ? <Clock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> : <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{o.label}</span>
                {o.sub && <span className="block truncate text-xs text-muted-foreground">{o.sub}</span>}
              </span>
              {o.kind === "history" && (
                <button type="button" aria-label={`Удалить «${o.label}» из истории`} onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); removeHistory(o.label); }} className="rounded p-1 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" aria-hidden />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
