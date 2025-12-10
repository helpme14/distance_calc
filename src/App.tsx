import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { MapView } from "./components/MapView";
import { Summary } from "./components/Summary";
import { fetchMatrix, fetchRoutes } from "./services/api";
import type {
  Coordinate,
  Destination,
  MatrixResult,
  RouteGeometry,
} from "./types";
import { Header } from "./components/Header";
import { OriginForm } from "./components/OriginForm";
import { DestinationForm } from "./components/DestinationForm";

type CoordinateInputs = {
  lat: string;
  lng: string;
};

type OriginInputs = {
  label: string;
} & CoordinateInputs;

type DestInputs = {
  label: string;
} & CoordinateInputs;

function App() {
  const [origin, setOrigin] = useState<Coordinate | null>(null);
  const [originInputs, setOriginInputs] = useState<{
    label: string;
    lat: string;
    lng: string;
  }>({
    label: "",
    lat: "",
    lng: "",
  });
  const [destInputs, setDestInputs] = useState<
    { label: string } & CoordinateInputs
  >({
    label: "",
    lat: "",
    lng: "",
  });
  const [destination, setDestination] = useState<Destination | null>(null);
  const [mapMode, setMapMode] = useState<"origin" | "destination">(
    "destination"
  );
  const [placeholderPin, setPlaceholderPin] = useState<Coordinate | null>(null);
  const [results, setResults] = useState<MatrixResult | null>(null);
  const [routes, setRoutes] = useState<RouteGeometry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readyToCalculate = useMemo(
    () => origin && destination,
    [origin, destination]
  );

  const parseCoord = (value: string) => Number.parseFloat(value);

  const handlePickOrigin = (coord: Coordinate) => {
    setOrigin(coord);
    setOriginInputs({
      label: coord.label || "",
      lat: coord.lat.toFixed(6),
      lng: coord.lng.toFixed(6),
    });
  };

  const handlePickDestination = (coord: Coordinate) => {
    // Update inputs to show coordinates AND label
    setDestInputs({
      label: coord.label || destination?.label || "Destination",
      lat: coord.lat.toFixed(6),
      lng: coord.lng.toFixed(6),
    });
    // Force map mode to destination
    setMapMode("destination");
    // Directly set destination like origin does - no need to wait for Save button
    const label = coord.label || destination?.label || "Destination";
    const dest: Destination = {
      id: destination?.id || nanoid(),
      label,
      lat: coord.lat,
      lng: coord.lng,
    };
    setDestination(dest);
    setPlaceholderPin(null); // Clear placeholder since we have actual destination now
  };

  const handleOriginUpdate = () => {
    const lat = parseCoord(originInputs.lat);
    const lng = parseCoord(originInputs.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setOrigin({ lat, lng, label: originInputs.label || "Origin" });
    }
  };

  const handleSaveDestination = () => {
    const lat = parseCoord(destInputs.lat);
    const lng = parseCoord(destInputs.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setError("Destination coordinates must be valid numbers");
      return;
    }
    const label =
      destInputs.label.trim() || destination?.label || "Destination";
    const dest: Destination = {
      id: destination?.id || nanoid(),
      label,
      lat,
      lng,
    };
    setDestination(dest);
    setPlaceholderPin(null);
    // Don't clear inputs anymore - keep them so user can continue editing
    setError(null);
  };

  const handleClearDestination = () => {
    setDestination(null);
    setDestInputs({ label: "", lat: "", lng: "" });
    setPlaceholderPin(null);
    setResults(null);
    setRoutes([]);
  };

  const handleCalculate = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    setError(null);
    try {
      const matrix = await fetchMatrix(origin, [destination]);
      setResults(matrix);

      // Fetch route geometries
      const routeGeometries = await fetchRoutes(origin, [destination]);
      setRoutes(routeGeometries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reach backend");
      setResults(null);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:py-8 grid gap-4 lg:gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="space-y-3 sm:space-y-4 flex flex-col">
          <OriginForm
            values={originInputs}
            onChange={(next: OriginInputs) => setOriginInputs(next)}
            onSave={handleOriginUpdate}
            onLocationSelect={handlePickOrigin}
          />

          <DestinationForm
            values={destInputs}
            onChange={(next: DestInputs) => setDestInputs(next)}
            onClear={handleClearDestination}
            onSave={handleSaveDestination}
            onLocationSelect={handlePickDestination}
          />

          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2 sm:gap-3">
            <button
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-coral px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:translate-y-[-1px] disabled:opacity-60 text-sm sm:text-base"
              disabled={!readyToCalculate || loading}
              onClick={handleCalculate}
            >
              {loading ? "Calculating…" : "Calculate distances"}
            </button>
            <div className="text-xs sm:text-sm text-slate-300 px-2">
              {origin
                ? `📍 Origin: ${origin.lat.toFixed(4)}, ${origin.lng.toFixed(
                    4
                  )}`
                : "Pick an origin to start"}
            </div>
          </div>

          {destination && (
            <Summary
              results={results}
              origin={origin}
              destination={destination}
            />
          )}
          {destination && (
            <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                    ✓ {destination.label}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                  </div>
                </div>
                <button
                  className="flex-shrink-0 rounded-lg border border-red-400/30 bg-red-500/10 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition"
                  onClick={handleClearDestination}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="glass rounded-lg sm:rounded-2xl p-3 sm:p-4 lg:p-4 shadow-soft flex flex-col">
          <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs sm:text-sm text-slate-300 font-medium">
              📍 Map Mode:
            </span>
            <div className="inline-flex rounded-lg bg-white/10 p-1 gap-0.5">
              <button
                className={`rounded px-2 sm:px-3 py-1 text-xs font-semibold transition ${
                  mapMode === "origin"
                    ? "bg-gradient-to-r from-brand-blue to-brand-coral text-slate-950 shadow-md"
                    : "text-slate-200 hover:text-white"
                }`}
                onClick={() => setMapMode("origin")}
              >
                🟢 Origin
              </button>
              <button
                className={`rounded px-2 sm:px-3 py-1 text-xs font-semibold transition ${
                  mapMode === "destination"
                    ? "bg-gradient-to-r from-brand-blue to-brand-coral text-slate-950 shadow-md"
                    : "text-slate-200 hover:text-white"
                }`}
                onClick={() => setMapMode("destination")}
              >
                🔵 Dest
              </button>
            </div>
          </div>
          <MapView
            origin={origin}
            destination={destination}
            placeholderPin={placeholderPin}
            routes={routes}
            mapMode={mapMode}
            onPickDestination={handlePickDestination}
            onPickOrigin={handlePickOrigin}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
