import { useCallback, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

/** Запрос геолокации; результат кладём в стор, чтобы его видели все страницы. */
export function useGeolocation() {
  const location = useAppStore((s) => s.location);
  const setLocation = useAppStore((s) => s.setLocation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Геолокация не поддерживается браузером");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.code === err.PERMISSION_DENIED ? "Доступ к геолокации запрещён" : "Не удалось определить местоположение");
        setLoading(false);
      },
      { timeout: 8000 },
    );
  }, [setLocation]);

  return { location, loading, error, request, clear: () => setLocation(null) };
}
