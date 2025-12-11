import { useState, useEffect } from "react";

export function Header() {
  const [matrixQuota, setMatrixQuota] = useState<{
    remaining_requests: number;
    per_minute: number;
    timestamp: string;
  }>({
    remaining_requests: 500,
    per_minute: 40,
    timestamp: new Date().toISOString(),
  });

  const [routesQuota, setRoutesQuota] = useState<{
    remaining_requests: number;
    per_minute: number;
    timestamp: string;
  }>({
    remaining_requests: 2000,
    per_minute: 40,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const handleStorageChange = (e?: StorageEvent) => {
      if (e?.key === "api_quota_matrix" || !e) {
        const stored = localStorage.getItem("api_quota_matrix");
        if (stored) {
          try {
            const data = JSON.parse(stored);
            setMatrixQuota(data);
          } catch {
            // Invalid JSON, skip
          }
        }
      }

      if (e?.key === "api_quota_routes" || !e) {
        const stored = localStorage.getItem("api_quota_routes");
        if (stored) {
          try {
            const data = JSON.parse(stored);
            setRoutesQuota(data);
          } catch {
            // Invalid JSON, skip
          }
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
          Distance & ETA Calculator
        </h1>
        <p className="max-w-2xl text-xs sm:text-sm text-slate-300 md:text-base">
          Pick an origin, search for a destination, and get driving distances
          instantly. Perfect for logistics, route planning, and quick what-if
          scenarios.
        </p>

        {/* API Rate Limit - Matrix & Routes Quotas */}
        <div className="mt-4 flex flex-col gap-3 text-xs">
          {/* Matrix API Quota */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-2">
              <span className="text-slate-300">📊 Matrix API:</span>
              <span className="font-semibold text-blue-300">
                {matrixQuota.remaining_requests.toLocaleString()} / 500
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-2">
              <span className="text-slate-300">⏱️ Per Minute:</span>
              <span className="font-semibold text-blue-300">
                {matrixQuota.per_minute} / 40
              </span>
            </div>
          </div>

          {/* Routes API Quota */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
              <span className="text-slate-300">🛣️ Routes API:</span>
              <span className="font-semibold text-emerald-300">
                {routesQuota.remaining_requests.toLocaleString()} / 2,000
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
              <span className="text-slate-300">⏱️ Per Minute:</span>
              <span className="font-semibold text-emerald-300">
                {routesQuota.per_minute} / 40
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
