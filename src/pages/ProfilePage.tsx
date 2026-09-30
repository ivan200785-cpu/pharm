import { BellRing, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LocationButton } from "@/components/LocationButton";
import { useCatalog } from "@/hooks/useCatalog";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { formatPrice } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export default function ProfilePage() {
  const { profile, updateProfile, alerts, removeAlert, markAlertSeen, history, clearHistory, favorites } = useAppStore();
  const { medicines, offers } = useCatalog();
  const { triggered, unseen } = usePriceAlerts(offers);
  const name = (id: string) => medicines.find((m) => m.id === id)?.name ?? id;

  // Открытие профиля = «прочитали» уведомления
  useEffect(() => {
    unseen.forEach((t) => markAlertSeen(t.alert.medicineId));
  }, [unseen, markAlertSeen]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Профиль</h1>

      <Card className="space-y-4 p-5">
        <h2 className="font-semibold">Данные</h2>
        <label className="block text-sm"><span className="mb-1 block font-medium">Имя</span>
          <Input value={profile.name} onChange={(e) => updateProfile({ name: e.target.value })} placeholder="Как к вам обращаться" autoComplete="given-name" />
        </label>
        <label className="block text-sm"><span className="mb-1 block font-medium">Город</span>
          <Input value={profile.city} onChange={(e) => updateProfile({ city: e.target.value })} autoComplete="address-level2" />
        </label>
        <LocationButton />
        <p className="text-xs text-muted-foreground">Данные хранятся только в вашем браузере. В избранном: {favorites.length}.</p>
      </Card>

      <Card id="alerts" className="scroll-mt-20 space-y-3 p-5">
        <h2 className="flex items-center gap-2 font-semibold"><BellRing className="h-5 w-5" aria-hidden /> Уведомления о цене</h2>
        {alerts.length === 0 && <p className="text-sm text-muted-foreground">Нет подписок. Откройте карточку лекарства и нажмите «Следить за ценой».</p>}
        <ul className="space-y-2">
          {alerts.map((a) => {
            const hit = triggered.find((t) => t.alert.medicineId === a.medicineId);
            return (
              <li key={a.medicineId} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm">
                <div>
                  <Link to={`/medicine/${a.medicineId}`} className="font-medium hover:underline">{name(a.medicineId)}</Link>
                  <p className="text-muted-foreground">Порог: {formatPrice(a.targetPrice)} (было {formatPrice(a.basePrice)})</p>
                  {hit && <Badge variant="success">Цена снизилась: {formatPrice(hit.currentPrice)}</Badge>}
                </div>
                <Button variant="ghost" size="icon" aria-label={`Удалить подписку на ${name(a.medicineId)}`} onClick={() => removeAlert(a.medicineId)}><Trash2 className="h-4 w-4" aria-hidden /></Button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="space-y-3 p-5">
        <div className="flex items-center justify-between"><h2 className="font-semibold">История поиска</h2>
          {history.length > 0 && <Button variant="ghost" size="sm" onClick={clearHistory}>Очистить</Button>}</div>
        {history.length === 0 ? <p className="text-sm text-muted-foreground">Пока пусто</p> : (
          <ul className="flex flex-wrap gap-2">{history.map((h) => <li key={h}><Link className="rounded-full border px-3 py-1 text-sm hover:bg-accent" to={`/search?q=${encodeURIComponent(h)}`}>{h}</Link></li>)}</ul>
        )}
      </Card>
    </div>
  );
}
