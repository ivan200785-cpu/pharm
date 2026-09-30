// Чистые функции: склейка предложений с аптеками, фильтрация и сортировка.
import type {
  Coordinates, Medicine, MedicineWithPrices, OfferFilters, OfferWithPharmacy,
  Pharmacy, PharmacyOffer, SortKey,
} from "@/types";
import { AVAILABILITY_RANK, haversineKm } from "@/lib/utils";

export const EMPTY_FILTERS: OfferFilters = {
  priceRange: null, districts: [], only24h: false, delivery: "all", chains: [],
};

export function joinOffers(
  offers: PharmacyOffer[],
  pharmacies: Pharmacy[],
  user: Coordinates | null,
): OfferWithPharmacy[] {
  const byId = new Map(pharmacies.map((p) => [p.id, p]));
  const result: OfferWithPharmacy[] = [];
  for (const o of offers) {
    const pharmacy = byId.get(o.pharmacyId);
    if (!pharmacy) continue;
    result.push({ ...o, pharmacy, distanceKm: user ? haversineKm(user, pharmacy.coordinates) : null });
  }
  return result;
}

export function filterOffers(offers: OfferWithPharmacy[], f: OfferFilters): OfferWithPharmacy[] {
  return offers.filter(({ price, pharmacy: p }) => {
    if (f.priceRange && (price < f.priceRange[0] || price > f.priceRange[1])) return false;
    if (f.districts.length && !f.districts.includes(p.district)) return false;
    if (f.only24h && !p.is24Hours) return false;
    if (f.delivery === "delivery" && !p.hasDelivery) return false;
    if (f.delivery === "pickup" && p.hasDelivery) return false;
    if (f.chains.length && !f.chains.includes(p.chain)) return false;
    return true;
  });
}

export function sortOffers(offers: OfferWithPharmacy[], key: SortKey): OfferWithPharmacy[] {
  const arr = [...offers];
  switch (key) {
    case "price-asc": return arr.sort((a, b) => a.price - b.price);
    case "price-desc": return arr.sort((a, b) => b.price - a.price);
    case "distance": return arr.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    case "rating": return arr.sort((a, b) => b.pharmacy.rating - a.pharmacy.rating);
    // при равной доступности — дешевле выше
    case "availability":
      return arr.sort((a, b) => AVAILABILITY_RANK[a.availability] - AVAILABILITY_RANK[b.availability] || a.price - b.price);
  }
}

/** Минимальная цена среди предложений «в наличии»/«под заказ»; null, если нет. */
export function minAvailablePrice(offers: PharmacyOffer[]): number | null {
  const prices = offers.filter((o) => o.availability !== "out_of_stock").map((o) => o.price);
  return prices.length ? Math.min(...prices) : null;
}

export function summarize(medicine: Medicine, offers: PharmacyOffer[]): MedicineWithPrices {
  const own = offers.filter((o) => o.medicineId === medicine.id);
  const avail = own.filter((o) => o.availability !== "out_of_stock");
  return {
    medicine,
    minPrice: avail.length ? Math.min(...avail.map((o) => o.price)) : null,
    maxPrice: avail.length ? Math.max(...avail.map((o) => o.price)) : null,
    inStockCount: own.filter((o) => o.availability === "in_stock").length,
    offersCount: own.length,
  };
}
