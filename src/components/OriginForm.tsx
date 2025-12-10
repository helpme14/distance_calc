type CoordinateInputs = {
  label: string;
  lat: string;
  lng: string;
};

type Props = {
  values: CoordinateInputs;
  onChange: (next: CoordinateInputs) => void;
  onSave: () => void;
  onLocationSelect?: (coord: {
    lat: number;
    lng: number;
    label: string;
  }) => void;
};

import { LocationSearch } from "./LocationSearch";

export function OriginForm({
  values,
  onChange,
  onSave,
  onLocationSelect,
}: Props) {
  const handleLocationSelect = (coord: { lat: number; lng: number }) => {
    const newValues = {
      label: values.label,
      lat: coord.lat.toFixed(6),
      lng: coord.lng.toFixed(6),
    };
    onChange(newValues);
    // Immediately show pin on map
    if (onLocationSelect) {
      onLocationSelect({ ...coord, label: values.label });
    }
  };
  return (
    <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
      <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-slate-50">
          🟢 Origin
        </h3>
        <button
          className="rounded-lg border border-white/10 bg-white/10 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-semibold text-slate-100 hover:border-white/20 transition"
          onClick={onSave}
        >
          ✓ Save
        </button>
      </div>

      <label className="flex flex-col gap-1 text-xs sm:text-sm text-slate-300 mb-3">
        <span className="font-medium">Label</span>
        <input
          className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-slate-50 outline-none ring-brand-blue/60 focus:ring text-sm"
          value={values.label}
          onChange={(e) => onChange({ ...values, label: e.target.value })}
          placeholder="Home, Office, etc"
        />
      </label>

      <div className="mb-3">
        <label className="flex flex-col gap-2 text-xs sm:text-sm text-slate-300">
          <span className="font-medium">Search Location</span>
          <LocationSearch
            onSelect={handleLocationSelect}
            placeholder="Search origin..."
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
            placeholder="12.8761"
            inputMode="decimal"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs sm:text-sm text-slate-300">
          <span className="font-medium">Longitude</span>
          <input
            className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-slate-50 outline-none ring-brand-blue/60 focus:ring text-sm"
            value={values.lng}
            onChange={(e) => onChange({ ...values, lng: e.target.value })}
            placeholder="121.7740"
            inputMode="decimal"
          />
        </label>
      </div>
    </div>
  );
}
