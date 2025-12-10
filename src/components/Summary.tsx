import type { MatrixResult, Coordinate, Destination } from "../types";

type Props = {
  results: MatrixResult | null;
  origin: Coordinate | null;
  destination: Destination | null;
};

export function Summary({ results, origin, destination }: Props) {
  if (!results || !origin || !destination) return null;

  const distance = results.distances[0] ?? 0;
  const duration = results.durations[0] ?? 0;

  return (
    <div className="space-y-4">
      {/* Detailed Route */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 font-semibold text-slate-50">📍 Route Details</div>
        <div className="space-y-3 text-sm">
          {/* Origin */}
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-green-400">●</span>
            <div className="flex-1">
              <div className="font-semibold text-slate-100">
                {origin.label || "Origin"}
              </div>
              <div className="text-xs text-slate-400">
                {origin.lat.toFixed(6)}, {origin.lng.toFixed(6)}
              </div>
            </div>
          </div>

          {/* Route to destination */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-4 w-0.5 bg-slate-600 mx-2"></div>
            </div>
            <div className="flex items-start gap-2 pl-2">
              <span className="mt-0.5 text-blue-400">●</span>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-100">
                    {destination.label}
                  </span>
                  <span className="text-sky-300">{distance.toFixed(2)} km</span>
                </div>
                <div className="text-xs text-slate-400">
                  {destination.lat.toFixed(6)}, {destination.lng.toFixed(6)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  ~{Math.round(duration / 60)} mins
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Statistics */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-50">
            📊 Trip Summary
          </h3>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
            1 route
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          <Stat label="Total Distance" value={`${distance.toFixed(2)} km`} />
          <Stat
            label="Total Time"
            value={`${Math.round(duration / 60)} mins`}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg sm:rounded-lg border border-white/10 bg-white/5 px-2 sm:px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="text-lg sm:text-xl font-semibold text-slate-50">
        {value}
      </div>
    </div>
  );
}
