import { useState, useEffect } from "react";

export function Header() {
  const [apiUsage, setApiUsage] = useState<{
    remaining_day: number;
    remaining_minute: number;
  }>({
    remaining_day: 2000,
    remaining_minute: 40,
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("api_usage");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setApiUsage(data);
        } catch {
          // Invalid JSON, skip
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <header className="glass flex flex-col gap-3 sm:gap-4 rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-soft lg:flex-row lg:items-start lg:justify-between mx-3 sm:mx-4 mt-3 sm:mt-4">
      <div className="space-y-1 sm:space-y-2 flex-1">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-200">
          🗺️ OpenRouteService powered
        </p>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-slate-50">
          Janinestance (Distance) & ETA Calculator
        </h1>
        <p className="max-w-2xl text-xs sm:text-sm text-slate-300 md:text-base">
          Pick an origin, search for a destination, and get driving distances
          instantly. Perfect for logistics, route planning, and quick what-if
          scenarios.
        </p>

        {/* API Rate Limits - Real-time */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
            <span className="text-slate-400">Daily Remaining:</span>
            <span className="font-semibold text-sky-300">
              {apiUsage.remaining_day.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
            <span className="text-slate-400">Per Minute:</span>
            <span className="font-semibold text-sky-300">
              {apiUsage.remaining_minute}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
