import { BellOff, BellRing } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

/** Подписка на снижение цены: пользователь задаёт порог, по умолчанию −10% от текущей минимальной. */
export function PriceAlertForm({ medicineId, currentMin }: { medicineId: string; currentMin: number | null }) {
  const alert = useAppStore((s) => s.alerts.find((a) => a.medicineId === medicineId));
  const setAlert = useAppStore((s) => s.setAlert);
  const removeAlert = useAppStore((s) => s.removeAlert);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(currentMin ? String(Math.floor(currentMin * 0.9)) : "");

  if (currentMin === null) return null;

  if (alert && !open) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-md bg-accent p-3 text-sm text-accent-foreground">
        <BellRing className="h-4 w-4" aria-hidden />
        Сообщим, когда цена опустится до {formatPrice(alert.targetPrice)}
        <Button variant="ghost" size="sm" onClick={() => removeAlert(medicineId)}><BellOff className="h-4 w-4" aria-hidden /> Отключить</Button>
      </div>
    );
  }

  if (!open) {
    return <Button variant="outline" onClick={() => setOpen(true)}><BellRing className="h-4 w-4" aria-hidden /> Следить за ценой</Button>;
  }

  const value = Number(target);
  const valid = Number.isFinite(value) && value > 0;
  return (
    <form
      className="flex flex-wrap items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        setAlert({ medicineId, targetPrice: value, basePrice: currentMin, createdAt: new Date().toISOString() });
        setOpen(false);
      }}
    >
      <label className="text-sm">
        <span className="mb-1 block font-medium">Сообщить, когда цена ≤ (₽)</span>
        <Input type="number" min={1} inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} className="w-40" />
      </label>
      <Button type="submit" disabled={!valid}>Сохранить</Button>
      <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
    </form>
  );
}
