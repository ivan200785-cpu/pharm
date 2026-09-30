import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { minAvailablePrice } from "@/services/offers";
import type { PharmacyOffer, PriceAlert } from "@/types";

export interface TriggeredAlert { alert: PriceAlert; currentPrice: number }

/**
 * Проверяет подписки на снижение цены: сработала та, у которой текущая
 * минимальная цена ≤ целевой. Возвращает только ещё не просмотренные.
 */
export function usePriceAlerts(offers: PharmacyOffer[]) {
  const alerts = useAppStore((s) => s.alerts);
  const seen = useAppStore((s) => s.seenAlerts);
  return useMemo(() => {
    const all: TriggeredAlert[] = [];
    for (const alert of alerts) {
      const current = minAvailablePrice(offers.filter((o) => o.medicineId === alert.medicineId));
      if (current !== null && current <= alert.targetPrice) all.push({ alert, currentPrice: current });
    }
    return { triggered: all, unseen: all.filter((t) => !seen.includes(t.alert.medicineId)) };
  }, [alerts, seen, offers]);
}
