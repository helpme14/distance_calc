import type { Destination, MatrixResult } from "../types";

type Props = {
  destinations: Destination[];
  results: MatrixResult | null;
  onRemove: (id: string) => void;
};

export function DestinationList({ destinations, results, onRemove }: Props) {
  if (!destinations.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-slate-400">
        Add at least one destination to compute distances.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {destinations.map((dest, index) => {
        const distanceKm = results?.distances?.[index];
        const durationSec = results?.durations?.[index];
        const durationMin = durationSec ? Math.round(durationSec / 60) : null;

        return (
          <div
            key={dest.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-slate-50">
                  {dest.label}
                </div>
                <div className="text-sm text-slate-400">
                  {dest.lat.toFixed(4)}, {dest.lng.toFixed(4)}
                </div>
              </div>
              <button
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-white/20"
                onClick={() => onRemove(dest.id)}
              >
                Remove
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Metric
                label="Distance"
                value={distanceKm ? `${distanceKm.toFixed(2)} km` : "—"}
              />
              <Metric
                label="ETA"
                value={durationMin ? `${durationMin} min` : "—"}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="text-lg font-semibold text-slate-50">{value}</div>
    </div>
  );
}
