import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/StateViews";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";

export default function FavoritesPage() {
  const favorites = useAppStore((s) => s.favorites);
  const toggle = useAppStore((s) => s.toggleFavorite);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Избранные запросы</h1>
      {favorites.length === 0 ? (
        <EmptyState title="Пока пусто" hint="На странице поиска нажмите «В избранное», чтобы сохранить запрос" action={<Button asChild variant="outline"><Link to="/">К поиску</Link></Button>} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {favorites.map((f) => (
            <li key={f}>
              <Card className="flex items-center justify-between gap-2 p-3">
                <Link to={`/search?q=${encodeURIComponent(f)}`} className="min-w-0 flex-1 truncate px-2 font-medium hover:underline">{f}</Link>
                <Button variant="ghost" size="icon" aria-label={`Удалить «${f}» из избранного`} onClick={() => toggle(f)}><Trash2 className="h-4 w-4" aria-hidden /></Button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
