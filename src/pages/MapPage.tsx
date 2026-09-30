import { lazy, Suspense, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { LocationButton } from "@/components/LocationButton";
import { ErrorState } from "@/components/StateViews";
import { Skeleton } from "@/components/ui/skeleton";
import { useCatalog } from "@/hooks/useCatalog";
import { useAppStore } from "@/store/useAppStore";

const PharmacyMap = lazy(() => import("@/components/PharmacyMap"));

/** Карта всех аптек; при выбранном лекарстве на маркерах показываются цены. */
export default function MapPage() {
  const [params, setParams] = useSearchParams();
  const medicineId = params.get("medicine") ?? "";
  const { medicines, pharmacies, offers, error, retry } = useCatalog();
  const location = useAppStore((s) => s.location);

  const markers = useMemo(() => {
    if (!medicineId) return pharmacies.map((pharmacy) => ({ pharmacy }));
    const byPharmacy = new Map(offers.filter((o) => o.medicineId === medicineId).map((o) => [o.pharmacyId, o]));
    return pharmacies
      .filter((p) => byPharmacy.has(p.id))
      .map((pharmacy) => ({ pharmacy, price: byPharmacy.get(pharmacy.id)!.price, availability: byPharmacy.get(pharmacy.id)!.availability }));
  }, [medicineId, pharmacies, offers]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold">Карта аптек</h1>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Цены на карте для</span>
            <select value={medicineId} onChange={(e) => setParams(e.target.value ? { medicine: e.target.value } : {})} className="h-10 max-w-[16rem] rounded-md border border-input bg-card px-3 text-sm">
              <option value="">— все аптеки —</option>
              {medicines.map((m) => <option key={m.id} value={m.id}>{m.name} {m.dosage}</option>)}
            </select>
          </label>
          <LocationButton />
        </div>
      </div>
      {error ? <ErrorState message={error} onRetry={retry} /> : (
        <Suspense fallback={<Skeleton className="h-[65vh]" />}>
          <PharmacyMap markers={markers} user={location} height="65vh" />
        </Suspense>
      )}
      <p className="text-sm text-muted-foreground">Зелёный — в наличии, оранжевый — под заказ, красный — нет в наличии.</p>
    </div>
  );
}
