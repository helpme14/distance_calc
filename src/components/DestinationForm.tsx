type DestinationInputs = {
  label: string;
  lat: string;
  lng: string;
};

type Props = {
  values: DestinationInputs;
  onChange: (next: DestinationInputs) => void;
  onSave: () => void;
  onClear: () => void;
  onLocationSelect?: (coord: {
    lat: number;
    lng: number;
    label: string;
  }) => void;
};

import { LocationSearch } from "./LocationSearch";

export function DestinationForm({
  values,
  onChange,
  onSave,
  onClear,
  onLocationSelect,
}: Props) {
  const handleLocationSelect = (coord: { lat: number; lng: number }) => {
    const newValues = {
      ...values,
      lat: coord.lat.toFixed(6),
      lng: coord.lng.toFixed(6),
    };
    onChange(newValues);
    // Immediately show pin on map
    if (onLocationSelect) {
      onLocationSelect({
        ...coord,
        label: values.label || `Stop ${values.label}`,
      });
    }
  };

  return (
    <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
      <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-slate-50">
          🔵 Destination
        </h3>
        <button
          className="rounded-lg border border-white/10 bg-white/10 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-semibold text-slate-100 hover:border-white/20 transition"
          onClick={onClear}
        >
          Clear
        </button>
      </div>

      <label className="flex flex-col gap-1 text-xs sm:text-sm text-slate-300 mb-3">
        <span className="font-medium">Label</span>
        <input
          className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-slate-50 outline-none ring-brand-blue/60 focus:ring text-sm"
          value={values.label}
          onChange={(e) => onChange({ ...values, label: e.target.value })}
          placeholder="Warehouse, Client, Stop 1"
        />
      </label>

      <div className="mb-3">
        <label className="flex flex-col gap-2 text-xs sm:text-sm text-slate-300">
          <span className="font-medium">Search Location</span>
          <LocationSearch
            onSelect={handleLocationSelect}
            placeholder="Search destination..."
          />
        </label>
      </div>

      <div className="mb-4 grid gap-2 sm:gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs sm:text-sm text-slate-300">
          <span className="font-medium">Latitude</span>
          <input
            className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-slate-50 outline-none ring-brand-blue/60 focus:ring text-sm"
            value={values.lat}
            onChange={(e) => onChange({ ...values, lat: e.target.value })}
            placeholder="37.7739"
            inputMode="decimal"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs sm:text-sm text-slate-300">
          <span className="font-medium">Longitude</span>
          <input
            className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-slate-50 outline-none ring-brand-blue/60 focus:ring text-sm"
            value={values.lng}
            onChange={(e) => onChange({ ...values, lng: e.target.value })}
            placeholder="-122.4312"
            inputMode="decimal"
          />
        </label>
      </div>

      <button
        className="w-full rounded-xl bg-gradient-to-r from-brand-blue to-brand-coral px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-slate-950 shadow-md shadow-sky-500/20 transition hover:translate-y-[-1px]"
        onClick={onSave}
      >
        ✓ Save destination
      </button>
    </div>
  );
}
