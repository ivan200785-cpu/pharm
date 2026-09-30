// Реальные аптечные сайты: кнопка открывает поиск на их стороне с запросом пользователя.
// Свои цены мы не подделываем — актуальные цены и наличие видны только на этих сайтах.
// Шаблоны адресов поиска могут измениться у самих сайтов: при необходимости правьте здесь.
export interface PharmacySite {
  name: string;
  searchUrl: (query: string) => string;
}

const enc = encodeURIComponent;

export const PHARMACY_SITES: PharmacySite[] = [
  { name: "Аптека April", searchUrl: (q) => `https://apteka-april.ru/search?q=${enc(q)}` },
  { name: "Столички", searchUrl: (q) => `https://stolichki.ru/search?name=${enc(q)}` },
  { name: "Аптека.ру", searchUrl: (q) => `https://apteka.ru/search/?q=${enc(q)}` },
  { name: "Ригла", searchUrl: (q) => `https://www.rigla.ru/search?q=${enc(q)}` },
  { name: "ЕАПТЕКА", searchUrl: (q) => `https://www.eapteka.ru/search/?q=${enc(q)}` },
  { name: "ЗдравСити", searchUrl: (q) => `https://zdravcity.ru/search/?what=${enc(q)}` },
];
