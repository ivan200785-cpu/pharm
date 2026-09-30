import { Bike, Clock, MapPin, Star, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AVAILABILITY_LABEL, formatDate, formatDistance, formatPrice } from "@/lib/utils";
import type { Availability, OfferWithPharmacy } from "@/types";

const VARIANT: Record<Availability, "success" | "warning" | "destructive"> = {
  in_stock: "success", on_order: "warning", out_of_stock: "destructive",
};

export function OfferCard({ offer, highlight }: { offer: OfferWithPharmacy; highlight?: boolean }) {
  const { pharmacy: p } = offer;
  const unavailable = offer.availability === "out_of_stock";
  return (
    <Card className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center ${highlight ? "border-primary ring-1 ring-primary" : ""} ${unavailable ? "opacity-70" : ""}`}>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{p.name}</h3>
          <Badge variant="muted"><Store className="h-3 w-3" aria-hidden />{p.chain}</Badge>
          {highlight && <Badge>Лучшая цена</Badge>}
        </div>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          {p.address}, {p.district} р-н
          {offer.distanceKm !== null && <strong className="ml-1 text-foreground">· {formatDistance(offer.distanceKm)}</strong>}
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden />{p.workingHours}</span>
          <span className="flex items-center gap-1" aria-label={`Рейтинг ${p.rating} из 5`}>
            <Star className="h-4 w-4 fill-warning text-warning" aria-hidden />{p.rating.toFixed(1)}
          </span>
          {p.hasDelivery && <span className="flex items-center gap-1"><Bike className="h-4 w-4" aria-hidden />Доставка</span>}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
        <span className="text-2xl font-bold">{formatPrice(offer.price)}</span>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={VARIANT[offer.availability]}>{AVAILABILITY_LABEL[offer.availability]}</Badge>
          <span className="text-xs text-muted-foreground">обновлено {formatDate(offer.updatedAt)}</span>
        </div>
      </div>
    </Card>
  );
}
