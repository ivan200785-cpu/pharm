import { ArrowLeft, List, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FiltersPanel } from "@/components/FiltersPanel";
import { LazyImage } from "@/components/LazyImage";
import { LocationButton } from "@/components/LocationButton";
import { OfferCard } from "@/components/OfferCard";
import { PriceAlertForm } from "@/components/PriceAlertForm";
import { SortSelect } from "@/components/SortSelect";
import { ExternalSearch } from "@/components/ExternalSearch";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/StateViews";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks/useAsync";
import { useCatalog } from "@/hooks/useCatalog";
import { api } from "@/services/api";
import { EMPTY_FILTERS, filterOffers, joinOffers, minAvailablePrice, sortOffers } from "@/services/offers";
import { useAppStore } from "@/store/useAppStore";
import type { OfferFilters, SortKey } from "@/types";

const PharmacyMap = lazy(() => import("@/components/PharmacyMap"));

export default function MedicinePage() {
  const { id = "" } = useParams();
  const { data: medicine, loading, error, retry } = useAsync(() => api.getMedicine(id), [id]);
  const catalog = useCatalog();
  const location = useAppStore((s) => s.location);

  const [sort, setSort] = useState<SortKey>("price-asc");
  const [filters, setFilters] = useState<OfferFilters>(EMPTY_FILTERS);
  const [view, setView] = useState<"list" | "map">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const medicineOffers = useMemo(() => catalog.offers.filter((o) => o.medicineId === id), [catalog.offers, id]);
  const joined = useMemo(() => joinOffers(medicineOffers, catalog.pharmacies, location), [medicineOffers, catalog.pharmacies, location]);
  const shown = useMemo(() => {
    // если геолокацию отключили, а выбрана сортировка по расстоянию — откатываемся на цену
    const key = sort === "distance" && !location ? "price-asc" : sort;
    return sortOffers(filterOffers(joined, filters), key);
  }, [joined, filters, sort, location]);

  const bestPrice = minAvailablePrice(medicineOffers);

  if (error) return <div className="space-y-4"><BackLink /><ErrorState message={error} onRetry={retry} /></div>;
  if (loading || !medicine) return <div className="space-y-4"><BackLink /><Skeleton className="h-56" /><ListSkeleton /></div>;

  return (
    <div className="space-y-6">
      <BackLink />
      <Card className="flex flex-col gap-5 p-5 md:flex-row">
        <LazyImage src={medicine.imageUrl} alt={`Упаковка ${medicine.name}`} className="mx-auto h-56 w-56 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold">{medicine.name} <span className="font-normal text-muted-foreground">{medicine.dosage}</span></h1>
              <p className="text-muted-foreground">{medicine.activeSubstance} · {medicine.form}</p>
            </div>
            <FavoriteButton medicineId={medicine.id} name={medicine.name} />
          </div>
          <p className="text-sm">Производитель: <strong>{medicine.manufacturer}</strong>, {medicine.country}</p>
          <p>{medicine.description}</p>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div><h2 className="mb-1 font-semibold">Показания</h2><ul className="list-disc space-y-0.5 pl-5">{medicine.indications.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><h2 className="mb-1 font-semibold">Противопоказания</h2><ul className="list-disc space-y-0.5 pl-5">{medicine.contraindications.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
          <p className="text-xs text-muted-foreground">Информация носит справочный характер. Перед применением проконсультируйтесь с врачом.</p>
          <PriceAlertForm medicineId={medicine.id} currentMin={bestPrice} />
        </div>
      </Card>

      <section aria-labelledby="offers-h" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="offers-h" className="text-xl font-semibold">Где купить <span className="text-base font-normal text-muted-foreground">({shown.length} из {joined.length})</span></h2>
          <div className="flex flex-wrap items-center gap-3">
            <LocationButton />
            <SortSelect value={sort} onChange={setSort} hasLocation={!!location} />
            <div role="group" aria-label="Вид" className="flex rounded-md border">
              <Button variant={view === "list" ? "default" : "ghost"} size="sm" aria-pressed={view === "list"} onClick={() => setView("list")}><List className="h-4 w-4" aria-hidden /> Список</Button>
              <Button variant={view === "map" ? "default" : "ghost"} size="sm" aria-pressed={view === "map"} onClick={() => setView("map")}><MapIcon className="h-4 w-4" aria-hidden /> Карта</Button>
            </div>
            <Button variant="outline" size="sm" className="lg:hidden" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((v) => !v)}>
              <SlidersHorizontal className="h-4 w-4" aria-hidden /> Фильтры
            </Button>
          </div>
        </div>

        <ExternalSearch query={medicine.name} title="Актуальные цены — на сайтах аптек" />

        <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
          <aside aria-label="Фильтры" className={`${filtersOpen ? "block" : "hidden"} h-fit rounded-lg border bg-card p-4 lg:block`}>
            <FiltersPanel offers={joined} filters={filters} onChange={setFilters} />
          </aside>

          <div>
            {catalog.error ? <ErrorState message={catalog.error} onRetry={catalog.retry} />
              : catalog.loading ? <ListSkeleton />
              : shown.length === 0 ? <EmptyState title="Нет аптек под выбранные фильтры" action={<Button variant="outline" onClick={() => setFilters(EMPTY_FILTERS)}>Сбросить фильтры</Button>} />
              : view === "list" ? (
                <ul className="space-y-3">
                  {shown.map((o) => (
                    <li key={o.pharmacyId}><OfferCard offer={o} highlight={o.availability !== "out_of_stock" && o.price === bestPrice} /></li>
                  ))}
                </ul>
              ) : (
                <Suspense fallback={<Skeleton className="h-[60vh]" />}>
                  <PharmacyMap markers={shown.map((o) => ({ pharmacy: o.pharmacy, price: o.price, availability: o.availability }))} user={location} />
                </Suspense>
              )}
          </div>
        </div>
      </section>
    </div>
  );
}

function BackLink() {
  const navigate = useNavigate();
  return (
    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
      <ArrowLeft className="h-4 w-4" aria-hidden /> Назад
    </Button>
  );
}
