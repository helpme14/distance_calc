interface TravelModeSelectorProps {
  value: "driving-car" | "foot-walking" | "cycling-regular";
  onChange: (mode: "driving-car" | "foot-walking" | "cycling-regular") => void;
}

export function TravelModeSelector({
  value,
  onChange,
}: TravelModeSelectorProps) {
  return (
    <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3 shadow-soft">
      <label className="block text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wide">
        🚗 Travel Mode
      </label>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          onClick={() => onChange("driving-car")}
          className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
            value === "driving-car"
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          🚗 Car
        </button>
        <button
          onClick={() => onChange("foot-walking")}
          className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
            value === "foot-walking"
              ? "bg-green-600 text-white shadow-lg scale-105"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          🚶 Walking
        </button>
        <button
          onClick={() => onChange("cycling-regular")}
          className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
            value === "cycling-regular"
              ? "bg-purple-600 text-white shadow-lg scale-105"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          🚴 Cycling
        </button>
      </div>
    </div>
  );
}
