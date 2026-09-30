import { Crosshair, LocateOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";

export function LocationButton() {
  const { location, loading, error, request, clear } = useGeolocation();
  return (
    <div className="flex flex-col items-start gap-1">
      {location ? (
        <Button variant="outline" size="sm" onClick={clear}><LocateOff className="h-4 w-4" aria-hidden /> Отключить геолокацию</Button>
      ) : (
        <Button variant="outline" size="sm" onClick={request} disabled={loading}>
          <Crosshair className="h-4 w-4" aria-hidden /> {loading ? "Определяем…" : "Рядом со мной"}
        </Button>
      )}
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
