import type { ReactNode } from "react";
import { BarChart3, Home, Medal, Search } from "lucide-react";
import { NavLink } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/search", label: "Search Scores", icon: Search },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/top-group-a", label: "Top Group A", icon: Medal },
];

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-900/10 bg-[#0f2a43] text-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            className="text-xl font-semibold tracking-normal text-white"
          >
            G-Scores
          </NavLink>
          <div className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-teal-50 sm:block">
            THPT 2024 Score Portal
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col md:flex-row">
        <aside className="border-b border-slate-200 bg-white md:min-h-[calc(100vh-4rem)] md:w-72 md:border-b-0 md:border-r">
          <nav className="flex gap-2 overflow-x-auto px-4 py-4 md:flex-col md:gap-1 md:p-5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    [
                      "flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                    ].join(" ")
                  }
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
