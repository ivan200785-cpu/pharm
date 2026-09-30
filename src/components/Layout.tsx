import { Bell, Heart, Home, Map, Pill, User } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { CatalogProvider, useCatalog } from "@/hooks/useCatalog";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { to: "/", label: "Главная", icon: Home, end: true },
  { to: "/map", label: "Карта", icon: Map },
  { to: "/favorites", label: "Избранное", icon: Heart },
  { to: "/profile", label: "Профиль", icon: User },
];

function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
  );
}

function AlertBell() {
  const { offers } = useCatalog();
  const { unseen } = usePriceAlerts(offers);
  return (
    <Link to="/profile#alerts" aria-label={unseen.length ? `Уведомления: ${unseen.length} новых` : "Уведомления"} className="relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent">
      <Bell className="h-5 w-5" aria-hidden />
      {unseen.length > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
          {unseen.length}
        </span>
      )}
    </Link>
  );
}

function Shell() {
  const favCount = useAppStore((s) => s.favorites.length);
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-card focus:p-2">
        Перейти к содержимому
      </a>
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary">
            <Pill className="h-6 w-6" aria-hidden /> АптекаПоиск
          </Link>
          <nav aria-label="Основная навигация" className="ml-6 hidden gap-1 md:flex">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={navClass}>
                <Icon className="h-4 w-4" aria-hidden /> {label}
                {to === "/favorites" && favCount > 0 && <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{favCount}</span>}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <AlertBell />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      {/* Нижняя навигация для мобильных (mobile-first) */}
      <nav aria-label="Мобильная навигация" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-background md:hidden">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => cn("flex flex-col items-center gap-0.5 py-2 text-xs", isActive ? "text-primary" : "text-muted-foreground")}>
            <Icon className="h-5 w-5" aria-hidden /> {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function Layout() {
  return (
    <CatalogProvider>
      <Shell />
    </CatalogProvider>
  );
}
