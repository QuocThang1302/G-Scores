import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  ChevronRight,
  GraduationCap,
  Home,
  Medal,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/search", label: "Search Scores", icon: Search },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/top-group", label: "Top Group", icon: Medal },
];

type Theme = "light" | "dark";

const themeStorageKey = "g-scores-theme";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const currentPage =
    navItems.find((item) => item.to === location.pathname) ?? navItems[0];
  const isDarkMode = theme === "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-app text-foreground">
      <div className="flex min-h-screen">
        <aside className="app-sidebar sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-sidebar-border text-sidebar-foreground md:flex">
          <div className="border-b border-sidebar-border px-6 py-6">
            <NavLink
              to="/"
              className="flex items-center gap-3 text-sidebar-foreground"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-contrast shadow-lg shadow-sidebar-accent/25">
                <GraduationCap className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xl font-semibold tracking-normal">
                  G-Scores
                </span>
                <span className="mt-0.5 block text-xs font-medium text-sidebar-muted">
                  THPT 2024 Portal
                </span>
              </span>
            </NavLink>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-4 py-5">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
              Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    [
                      "flex min-h-12 items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-contrast shadow-lg shadow-sidebar-accent/25"
                        : "text-sidebar-muted hover:bg-sidebar-accent-soft hover:text-sidebar-foreground",
                    ].join(" ")
                  }
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <div className="mt-auto flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent-soft/70 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent/15 text-sidebar-accent">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground">
                  THPT 2024
                </p>
                <p className="mt-0.5 text-xs text-sidebar-muted">G-Scores</p>
              </div>
            </div>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
            <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-medium text-subtle">
                  <span>G-Scores</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="truncate text-muted">
                    {currentPage.label}
                  </span>
                </div>
                <h1 className="mt-1 truncate text-lg font-semibold tracking-normal text-foreground">
                  {currentPage.label}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                  className="icon-tile h-10 w-10 border border-border bg-surface-muted text-muted transition hover:text-foreground focus:outline-none focus:ring-4 focus:ring-primary-soft"
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                  title={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Moon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
                <span className="hidden h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-contrast sm:flex">
                  GS
                </span>
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto border-t border-border-muted px-4 py-3 md:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      [
                        "flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-contrast"
                          : "bg-surface-muted text-muted hover:bg-sidebar-accent-soft hover:text-sidebar-foreground",
                      ].join(" ")
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </header>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
