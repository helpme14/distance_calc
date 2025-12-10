import { useState, useEffect, useRef } from "react";
import type { Coordinate } from "../types";

type Props = {
  onSelect: (coord: Coordinate, label: string) => void;
  placeholder?: string;
};

// Philippines bounding box for search scope
const PHILIPPINES_BOUNDS = {
  minLat: 4.6,
  maxLat: 19.4,
  minLng: 116.9,
  maxLng: 126.6,
};

export function LocationSearch({
  onSelect,
  placeholder = "Search location...",
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Array<{ name: string; lat: number; lng: number }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if a coordinate is within Philippines bounds
  const isInPhilippines = (lat: number, lng: number): boolean => {
    return (
      lat >= PHILIPPINES_BOUNDS.minLat &&
      lat <= PHILIPPINES_BOUNDS.maxLat &&
      lng >= PHILIPPINES_BOUNDS.minLng &&
      lng <= PHILIPPINES_BOUNDS.maxLng
    );
  };

  // Debounced search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced search
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        // Using Nominatim (OpenStreetMap) - free, no API key needed
        // Scoped to Philippines region
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}, Philippines&limit=5&viewbox=116.9,4.6,126.6,19.4&bounded=1`
        );

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        const mapped = data
          .map((item: Record<string, unknown>) => {
            const lat = parseFloat(item.lat as string);
            const lng = parseFloat(item.lon as string);
            return {
              name: (item.display_name as string)
                .split(",")
                .slice(0, 2)
                .join(","),
              lat,
              lng,
            };
          })
          .filter((item: { lat: number; lng: number }) =>
            isInPhilippines(item.lat, item.lng)
          ); // Double-check Philippines scope

        setResults(mapped);
        setIsOpen(mapped.length > 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce delay

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = (result: (typeof results)[0]) => {
    const coord = { lat: result.lat, lng: result.lng };
    onSelect(coord, result.name);

    // Zoom map to the selected location
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapZoom = (window as any).__mapZoomToLocation;
      if (mapZoom) {
        mapZoom(coord);
      }
    }

    setQuery("");
    setResults([]);
    setIsOpen(false);
  };
  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-white/10 bg-white/10 px-3 sm:px-4 py-2 text-slate-50 outline-none ring-brand-blue/60 focus:ring text-sm"
        />
        {loading && (
          <div className="absolute right-2 sm:right-3 top-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-blue/30 border-t-brand-blue" />
          </div>
        )}
      </div>

      {error && (
        <div className="mt-1 text-xs sm:text-sm text-red-400">{error}</div>
      )}

      {isOpen && results.length > 0 && (
        <div className="fixed sm:absolute top-auto sm:top-full bottom-0 sm:bottom-auto left-0 right-0 sm:left-0 sm:right-0 sm:z-50 sm:mt-2 rounded-t-lg sm:rounded-lg border border-white/10 bg-slate-900 shadow-xl sm:shadow-lg max-h-[50vh] sm:max-h-[300px] overflow-y-auto z-40">
          {results.map((result, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(result)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-slate-200 hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg transition active:bg-white/20"
            >
              <div className="font-medium text-slate-50">{result.name}</div>
              <div className="text-xs text-slate-400">
                {result.lat.toFixed(4)}°, {result.lng.toFixed(4)}°
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
