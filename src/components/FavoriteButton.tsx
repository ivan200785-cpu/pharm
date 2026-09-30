import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function FavoriteButton({ medicineId, name }: { medicineId: string; name: string }) {
  const active = useAppStore((s) => s.favorites.includes(medicineId));
  const toggle = useAppStore((s) => s.toggleFavorite);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-pressed={active}
      aria-label={active ? `Убрать «${name}» из избранного` : `Добавить «${name}» в избранное`}
      onClick={() => toggle(medicineId)}
    >
      <Heart className={cn("h-5 w-5", active && "fill-destructive text-destructive")} aria-hidden />
    </Button>
  );
}
