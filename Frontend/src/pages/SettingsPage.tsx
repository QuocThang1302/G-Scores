import { Check, Moon, Settings, Sun } from "lucide-react";

import { useTheme } from "../contexts/ThemeContext";

export default function SettingsPage() {
  const { isDarkMode, setTheme, theme } = useTheme();

  return (
    <div className="page-shell">
      <section>
        <h1 className="section-title">Settings</h1>
        <p className="section-copy">
          Manage display preferences for this browser.
        </p>
      </section>

      <section className="panel mt-6 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <span className="icon-tile icon-tile-primary h-11 w-11">
            <Settings className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Preferences</p>
            <h2 className="text-lg font-semibold tracking-normal text-foreground">
              Appearance
            </h2>
          </div>
        </div>

        <div className="divide-y divide-border-muted">
          <div className="p-5">
            <div className="flex items-start gap-3">
              <span className="icon-tile icon-tile-neutral h-10 w-10">
                {isDarkMode ? (
                  <Moon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Sun className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
              <div>
                <p className="text-base font-semibold text-foreground">
                  Dark Mode
                </p>
                <p className="mt-1 text-sm text-subtle">
                  Current theme: {isDarkMode ? "Dark" : "Light"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {(["light", "dark"] as const).map((option) => {
              const isSelected = theme === option;
              const Icon = option === "dark" ? Moon : Sun;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTheme(option)}
                  className={[
                    "flex min-h-16 items-center justify-between gap-4 rounded-lg border px-4 text-left transition focus:outline-none focus:ring-4 focus:ring-primary-soft",
                    isSelected
                      ? "border-primary bg-primary-soft text-primary-text"
                      : "border-border bg-surface-raised text-muted hover:border-border-strong hover:text-foreground",
                  ].join(" ")}
                  aria-pressed={isSelected}
                >
                  <span className="flex items-center gap-3">
                    <span className="icon-tile h-10 w-10 bg-surface text-muted">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="capitalize">{option}</span>
                  </span>
                  {isSelected ? (
                    <Check className="h-5 w-5" aria-hidden="true" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
