import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { Coordinate, Destination, RouteGeometry } from "../types";
import "leaflet/dist/leaflet.css";

// Configure default marker assets so they render when bundled
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom markers for origin and destinations
const originIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Props = {
  origin: Coordinate | null;
  destination: Destination | null;
  placeholderPin: Coordinate | null;
  routes: RouteGeometry[];
  mapMode: "origin" | "destination";
  onPickDestination: (coord: Coordinate) => void;
  onPickOrigin: (coord: Coordinate) => void;
};

// Helper component to zoom to location
function ZoomController() {
  const map = useMap();

  useEffect(() => {
    // Make zoomToLocation available globally via window
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__mapZoomToLocation = (coord: Coordinate) => {
      map.setView([coord.lat, coord.lng], 11, { animate: true });
    };

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__mapZoomToLocation;
    };
  }, [map]);

  return null;
}

function MapClickHandler({
  mapMode,
  onPickOrigin,
  onPickDestination,
}: {
  mapMode: "origin" | "destination";
  onPickOrigin: (coord: Coordinate) => void;
  onPickDestination: (coord: Coordinate) => void;
}) {
  useMapEvents({
    click: (event) => {
      const { lat, lng } = event.latlng;
      if (mapMode === "origin") {
        onPickOrigin({ lat, lng });
      } else {
        onPickDestination({ lat, lng });
      }
    },
  });
  return null;
}

export function MapView({
  origin,
  destination,
  placeholderPin,
  routes,
  mapMode,
  onPickOrigin,
  onPickDestination,
}: Props) {
  // Default to Philippines center (Metro Manila area)
  const center: Coordinate = origin || { lat: 12.8797, lng: 121.774 };

  return (
    <div className="relative">
      <div className="flex justify-end mb-2 pr-2">
        <div className="rounded-full bg-white/10 px-3 py-2 text-sm text-slate-100">
          {mapMode === "origin"
            ? "Click map to set origin"
            : "Click map to set destination"}
        </div>
      </div>
      <MapContainer
        center={center}
        zoom={origin ? 8 : 7}
        scrollWheelZoom
        className="h-[350px] sm:h-[500px] md:h-[620px] w-full overflow-hidden rounded-lg sm:rounded-xl border border-white/10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapClickHandler
          mapMode={mapMode}
          onPickOrigin={onPickOrigin}
          onPickDestination={onPickDestination}
        />
        <ZoomController />

        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold text-green-600">Origin Point</div>
                <div className="text-sm">{origin.lat.toFixed(6)}</div>
                <div className="text-sm">{origin.lng.toFixed(6)}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {destination && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={destinationIcon}
          >
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold text-blue-600">
                  {destination.label}
                </div>
                <div className="text-sm">{destination.lat.toFixed(6)}</div>
                <div className="text-sm">{destination.lng.toFixed(6)}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Show placeholder pin during search/selection before saving */}
        {placeholderPin && !destination && (
          <Marker
            position={[placeholderPin.lat, placeholderPin.lng]}
            icon={destinationIcon}
            opacity={0.6}
          >
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold text-blue-600">
                  Destination (preview)
                </div>
                <div className="text-sm">{placeholderPin.lat.toFixed(6)}</div>
                <div className="text-sm">{placeholderPin.lng.toFixed(6)}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {origin && destination && (
          <Polyline
            positions={[
              [origin.lat, origin.lng],
              [destination.lat, destination.lng],
            ]}
            pathOptions={{ color: "#ff7f50", weight: 2, opacity: 0.7 }}
          />
        )}

        {/* Display calculated routes with actual road geometry */}
        {routes.map((route, idx) => (
          <Polyline
            key={`route-${idx}`}
            positions={route.coordinates.map(([lng, lat]) => [lat, lng])}
            pathOptions={{
              color: "#0ea5e9",
              weight: 3,
              opacity: 0.8,
              dashArray: "5, 5",
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
