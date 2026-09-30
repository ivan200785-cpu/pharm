import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Availability, Coordinates } from "@/types";

/** Склейка tailwind-классов без конфликтов (стандарт shadcn/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value);

export const formatDistance = (km: number) =>
  km < 1 ? `${Math.round(km * 1000)} м` : `${km.toFixed(1)} км`;

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  in_stock: "В наличии",
  on_order: "Под заказ",
  out_of_stock: "Нет в наличии",
};

/** Порядок для сортировки «сначала в наличии». */
export const AVAILABILITY_RANK: Record<Availability, number> = {
  in_stock: 0,
  on_order: 1,
  out_of_stock: 2,
};

/** Расстояние по формуле гаверсинусов, км. */
export function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
