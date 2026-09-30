# АптекаПоиск

Поиск лекарств в аптеках города: сравнение цен, сортировка, фильтры, карта.
React + TypeScript + Vite, Tailwind CSS + shadcn/ui (Radix), Zustand, Leaflet, Fuse.js.
Backend не нужен — данные в `src/data/*.json`; слой `src/services/api.ts` можно заменить на fetch к Express/PostgreSQL.

## Запуск
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # проверка типов + production-сборка
npm run gen:data   # перегенерировать моковые данные и SVG-упаковки
```

## Структура
```
src/
  types/        доменные типы (Medicine, Pharmacy, PharmacyOffer, фильтры…)
  data/         medicines / pharmacies / offers (.json)
  services/     api (мок с задержкой), search (Fuse.js), offers (join/filter/sort)
  store/        Zustand + persist: тема, избранное, история, подписки на цену, профиль
  hooks/        useDebounce, useAsync, useCatalog, useGeolocation, usePriceAlerts
  components/   ui/ (shadcn), SearchBox, MedicineCard, OfferCard, FiltersPanel, PharmacyMap…
  pages/        Home, Search, Medicine, Map, Favorites, Profile
```

## Заметки
- Фильтр «Только самовывоз» оставляет аптеки без доставки.
- Уведомление о цене срабатывает, когда минимальная цена ≤ порога; чтобы увидеть его на моках, задайте порог выше текущей цены.
- Сортировка по расстоянию включается после нажатия «Рядом со мной».
