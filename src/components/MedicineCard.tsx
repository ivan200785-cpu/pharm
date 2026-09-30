import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { MedicineWithPrices } from "@/types";
import { FavoriteButton } from "./FavoriteButton";
import { LazyImage } from "./LazyImage";

/** Превью лекарства в результатах поиска: фото, описание и вилка цен. */
export function MedicineCard({ item }: { item: MedicineWithPrices }) {
  const { medicine: m, minPrice, maxPrice, inStockCount, offersCount } = item;
  return (
    <Card className="relative flex gap-4 p-4 transition-shadow hover:shadow-md">
      <LazyImage src={m.imageUrl} alt={`Упаковка ${m.name}`} className="h-24 w-24 shrink-0 rounded-md sm:h-28 sm:w-28" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-semibold">
          {/* stretched link: вся карточка кликабельна, кнопка избранного остаётся поверх */}
          <Link to={`/medicine/${m.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-lg">
            {m.name} <span className="font-normal text-muted-foreground">{m.dosage}</span>
          </Link>
        </h3>
        <p className="truncate text-sm text-muted-foreground">{m.activeSubstance} · {m.form}</p>
        <p className="truncate text-sm text-muted-foreground">{m.manufacturer}, {m.country}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {minPrice !== null ? (
            <span className="text-lg font-bold text-primary">
              {minPrice === maxPrice ? formatPrice(minPrice) : <>от {formatPrice(minPrice)}</>}
              {minPrice !== maxPrice && maxPrice !== null && <span className="text-sm font-normal text-muted-foreground"> до {formatPrice(maxPrice)}</span>}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">Нет предложений</span>
          )}
          <Badge variant={inStockCount ? "success" : "muted"}>
            {inStockCount ? `В наличии в ${inStockCount} аптеках` : `Аптек: ${offersCount}`}
          </Badge>
        </div>
      </div>
      <div className="relative z-10 self-start">
        <FavoriteButton medicineId={m.id} name={m.name} />
      </div>
    </Card>
  );
}
