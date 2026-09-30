import { Link } from "react-router-dom";
import { MedicineCard } from "@/components/MedicineCard";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/StateViews";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/hooks/useCatalog";
import { summarize } from "@/services/offers";
import { useAppStore } from "@/store/useAppStore";

export default function FavoritesPage() {
  const favorites = useAppStore((s) => s.favorites);
  const { medicines, offers, loading, error, retry } = useCatalog();
  const items = medicines.filter((m) => favorites.includes(m.id)).map((m) => summarize(m, offers));

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Избранное</h1>
      {error ? <ErrorState message={error} onRetry={retry} />
        : loading ? <ListSkeleton rows={2} />
        : items.length === 0 ? <EmptyState title="Пока пусто" hint="Нажмите на сердечко у лекарства, чтобы сохранить его здесь" action={<Button asChild variant="outline"><Link to="/">К поиску</Link></Button>} />
        : <div className="grid gap-3 lg:grid-cols-2">{items.map((i) => <MedicineCard key={i.medicine.id} item={i} />)}</div>}
    </div>
  );
}
