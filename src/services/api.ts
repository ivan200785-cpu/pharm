// «Бэкенд» на моковых JSON. Все методы асинхронные с небольшой задержкой,
// чтобы UI корректно отрабатывал loading-состояния. Чтобы перейти на реальный
// Express + PostgreSQL, достаточно заменить тела функций на fetch().
import medicinesJson from "@/data/medicines.json";
import pharmaciesJson from "@/data/pharmacies.json";
import offersJson from "@/data/offers.json";
import type { Medicine, Pharmacy, PharmacyOffer } from "@/types";

// В JSON пути к картинкам абсолютные («/img/…») — добавляем base для GitHub Pages
const withBase = (url: string) => import.meta.env.BASE_URL + url.replace(/^\//, "");
const medicines = (medicinesJson as Medicine[]).map((m) => ({ ...m, imageUrl: withBase(m.imageUrl) }));
const pharmacies = pharmaciesJson as Pharmacy[];
// В JSON даты строками — приводим к Date
const offers: PharmacyOffer[] = offersJson.map((o) => ({
  ...(o as Omit<PharmacyOffer, "updatedAt">),
  updatedAt: new Date(o.updatedAt),
})) as PharmacyOffer[];

const delay = (ms = 250 + Math.random() * 250) => new Promise((r) => setTimeout(r, ms));

export class ApiError extends Error {}

export const api = {
  async getMedicines(): Promise<Medicine[]> {
    await delay();
    return medicines;
  },
  async getPharmacies(): Promise<Pharmacy[]> {
    await delay(150);
    return pharmacies;
  },
  async getOffers(medicineId?: string): Promise<PharmacyOffer[]> {
    await delay();
    return medicineId ? offers.filter((o) => o.medicineId === medicineId) : offers;
  },
  async getMedicine(id: string): Promise<Medicine> {
    await delay(150);
    const m = medicines.find((x) => x.id === id);
    if (!m) throw new ApiError("Лекарство не найдено");
    return m;
  },
};
