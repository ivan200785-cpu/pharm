import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/useAppStore";

// Страницы грузим лениво: карта (Leaflet) не попадает в начальный бандл.
const HomePage = lazy(() => import("@/pages/HomePage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const MedicinePage = lazy(() => import("@/pages/MedicinePage"));
const MapPage = lazy(() => import("@/pages/MapPage"));
const FavoritesPage = lazy(() => import("@/pages/FavoritesPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function App() {
  const theme = useAppStore((s) => s.theme);
  // Синхронизируем класс .dark на <html> с состоянием стора
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Suspense fallback={<Skeleton className="m-6 h-64" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="medicine/:id" element={<MedicinePage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
