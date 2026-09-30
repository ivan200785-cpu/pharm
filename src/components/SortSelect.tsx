import type { SortKey } from "@/types";

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "price-desc", label: "Цена: по убыванию" },
  { value: "distance", label: "Расстояние" },
  { value: "rating", label: "Рейтинг аптеки" },
  { value: "availability", label: "Сначала в наличии" },
];

export function SortSelect({ value, onChange, hasLocation }: { value: SortKey; onChange: (v: SortKey) => void; hasLocation: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="font-medium">Сортировка</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-10 rounded-md border border-input bg-card px-3 text-sm"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value} disabled={o.value === "distance" && !hasLocation}>
            {o.label}{o.value === "distance" && !hasLocation ? " (нужна геолокация)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
