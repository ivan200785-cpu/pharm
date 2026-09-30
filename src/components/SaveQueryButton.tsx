import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

/** Добавить/убрать запрос из избранного. */
export function SaveQueryButton({ query }: { query: string }) {
  const active = useAppStore((s) => s.favorites.some((f) => f.toLowerCase() === query.trim().toLowerCase()));
  const toggle = useAppStore((s) => s.toggleFavorite);
  return (
    <Button variant="outline" size="sm" aria-pressed={active} onClick={() => toggle(query)}>
      <Heart className={cn("h-4 w-4", active && "fill-destructive text-destructive")} aria-hidden />
      {active ? "В избранном" : "В избранное"}
    </Button>
  );
}
