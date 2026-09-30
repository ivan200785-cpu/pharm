// Доменные типы приложения. Расширяют интерфейсы из ТЗ полями,
// необходимые для карточки лекарства (страна, показания и т.д.).

export type MedicineForm =
  | "таблетки"
  | "капсулы"
  | "сироп"
  | "мазь"
  | "капли"
  | "спрей"
  | "раствор"
  | "порошок";

export type Availability = "in_stock" | "on_order" | "out_of_stock";

export interface Medicine {
  id: string;
  name: string;
  activeSubstance: string;
  dosage: string;
  form: MedicineForm;
  manufacturer: string;
  country: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  imageUrl: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  chain: string; // сеть аптек
  address: string;
  district: string;
  coordinates: { lat: number; lng: number };
  workingHours: string;
  is24Hours: boolean;
  rating: number;
  hasDelivery: boolean;
}

export interface PharmacyOffer {
  medicineId: string;
  pharmacyId: string;
  price: number;
  availability: Availability;
  updatedAt: Date;
}

/** Предложение, «склеенное» с данными аптеки и расстоянием — то, что рисует UI. */
export interface OfferWithPharmacy extends PharmacyOffer {
  pharmacy: Pharmacy;
  distanceKm: number | null; // null — геолокация недоступна
}

export interface MedicineWithPrices {
  medicine: Medicine;
  minPrice: number | null;
  maxPrice: number | null;
  inStockCount: number;
  offersCount: number;
}

export type SortKey =
  | "price-asc"
  | "price-desc"
  | "distance"
  | "rating"
  | "availability";

export type DeliveryMode = "all" | "delivery" | "pickup";

export interface OfferFilters {
  priceRange: [number, number] | null; // null — без ограничения
  districts: string[];
  only24h: boolean;
  delivery: DeliveryMode;
  chains: string[];
}

export interface PriceAlert {
  medicineId: string;
  /** Уведомить, когда минимальная цена станет ≤ targetPrice */
  targetPrice: number;
  /** Минимальная цена в момент создания подписки */
  basePrice: number;
  createdAt: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
