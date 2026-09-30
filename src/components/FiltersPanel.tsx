import { RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { formatPrice } from "@/lib/utils";
import { EMPTY_FILTERS } from "@/services/offers";
import type { DeliveryMode, OfferFilters, OfferWithPharmacy } from "@/types";

const DELIVERY: { value: DeliveryMode; label: string }[] = [
  { value: "all", label: "Любой способ" },
  { value: "delivery", label: "С доставкой" },
  { value: "pickup", label: "Только самовывоз" },
];

function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

/** Панель фильтров. Варианты (районы, сети, границы цены) строятся из самих предложений. */
export function FiltersPanel({
  offers, filters, onChange,
}: { offers: OfferWithPharmacy[]; filters: OfferFilters; onChange: (f: OfferFilters) => void }) {
  const { min, max, districts, chains } = useMemo(() => {
    const prices = offers.map((o) => o.price);
    return {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
      districts: [...new Set(offers.map((o) => o.pharmacy.district))].sort(),
      chains: [...new Set(offers.map((o) => o.pharmacy.chain))].sort(),
    };
  }, [offers]);

  const range = filters.priceRange ?? [min, max];
  const dirty = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Фильтры</h2>
        {dirty && (
          <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Сбросить
          </Button>
        )}
      </div>

      {max > min && (
        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-medium">Цена: {formatPrice(range[0])} – {formatPrice(range[1])}</legend>
          <Slider
            min={min} max={max} step={1} value={range}
            thumbLabels={["Минимальная цена", "Максимальная цена"]}
            onValueChange={(v) => onChange({ ...filters, priceRange: v[0] <= min && v[1] >= max ? null : [v[0], v[1]] })}
          />
        </fieldset>
      )}

      <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
        Круглосуточные аптеки
        <Switch checked={filters.only24h} onCheckedChange={(v) => onChange({ ...filters, only24h: v })} />
      </label>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Получение</legend>
        <div className="space-y-2">
          {DELIVERY.map((d) => (
            <label key={d.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="radio" name="delivery" className="h-4 w-4 accent-[hsl(var(--primary))]" checked={filters.delivery === d.value} onChange={() => onChange({ ...filters, delivery: d.value })} />
              {d.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Район</legend>
        <div className="space-y-2">
          {districts.map((d) => (
            <label key={d} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={filters.districts.includes(d)} onCheckedChange={() => onChange({ ...filters, districts: toggle(filters.districts, d) })} />
              {d}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Сеть аптек</legend>
        <div className="space-y-2">
          {chains.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={filters.chains.includes(c)} onCheckedChange={() => onChange({ ...filters, chains: toggle(filters.chains, c) })} />
              {c}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
