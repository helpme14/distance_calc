import type { Coordinate, Destination, MatrixResult } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// Helper function to extract and store quota from response headers
function extractAndStoreQuota(
  response: Response,
  apiType: "matrix" | "routes"
) {
  // OpenRouteService headers
  const dailyRemaining = response.headers.get("x-ratelimit-remaining");
  const dailyLimit = response.headers.get("x-ratelimit-limit");

  if (dailyRemaining || dailyLimit) {
    const apiQuota = {
      remaining_requests: dailyRemaining
        ? parseInt(dailyRemaining, 10)
        : apiType === "matrix"
        ? 500
        : 2000,
      per_minute: 40, // ORS hard limit: 40 requests per minute (not sent in headers)
      timestamp: new Date().toISOString(),
    };
    // Store separately for each API type
    const storageKey = `api_quota_${apiType}`;
    localStorage.setItem(storageKey, JSON.stringify(apiQuota));
    // Trigger storage event for other tabs
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: storageKey,
        newValue: JSON.stringify(apiQuota),
      })
    );
  }
}

export async function fetchMatrix(
  origin: Coordinate,
  destinations: Destination[],
  travelMode: "driving-car" | "foot-walking" | "cycling-regular" = "driving-car"
): Promise<MatrixResult> {
  const response = await fetch(`${API_BASE}/matrix`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ origin, destinations, travelMode }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Matrix request failed");
  }

  // Extract and store quota from response
  extractAndStoreQuota(response, "matrix");

  return response.json();
}

export async function fetchRoutes(
  origin: Coordinate,
  destinations: Destination[],
  travelMode: "driving-car" | "foot-walking" | "cycling-regular" = "driving-car"
): Promise<Array<{ coordinates: Array<[number, number]> }>> {
  const response = await fetch(`${API_BASE}/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ origin, destinations, travelMode }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Routes request failed");
  }

  // Extract and store quota from response
  extractAndStoreQuota(response, "routes");

  return response.json();
}
