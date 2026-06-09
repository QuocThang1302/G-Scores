import type { ReactNode } from "react";
import {
  BarChart3,
  ChevronRight,
  GraduationCap,
  Home,
  Medal,
  Search,
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

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const currentPage =
    navItems.find((item) => item.to === location.pathname) ?? navItems[0];

  return (
    <div className="min-h-screen bg-[#f3f6fb]">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-[#111827] text-slate-300 md:flex">
          <div className="border-b border-white/10 px-6 py-6">
            <NavLink to="/" className="flex items-center gap-3 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-500 text-white shadow-lg shadow-teal-950/30">
                <GraduationCap className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xl font-semibold tracking-normal">
                  G-Scores
                </span>
                <span className="mt-0.5 block text-xs font-medium text-slate-400">
                  THPT 2024 Portal
                </span>
              </span>
            </NavLink>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-4 py-5">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-950/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white",
                    ].join(" ")
                  }
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <div className="mt-auto flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/15 text-teal-300">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">THPT 2024</p>
                <p className="mt-0.5 text-xs text-slate-400">G-Scores</p>
              </div>
            </div>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span>G-Scores</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="truncate text-slate-700">
                    {currentPage.label}
                  </span>
                </div>
                <h1 className="mt-1 truncate text-lg font-semibold tracking-normal text-slate-950">
                  {currentPage.label}
                </h1>
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
                  GS
                </span>
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 md:hidden">
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
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200",
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
