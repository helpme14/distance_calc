import type { Coordinate, Destination, MatrixResult } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export async function fetchMatrix(
  origin: Coordinate,
  destinations: Destination[]
): Promise<MatrixResult> {
  const response = await fetch(`${API_BASE}/matrix`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ origin, destinations }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Matrix request failed");
  }

  // Extract and store API rate limit headers from response
  const remainingDay = response.headers.get("x-ratelimit-trytomorrow");
  const remainingMinute = response.headers.get("x-ratelimit-interval-searches");

  if (remainingDay || remainingMinute) {
    const apiUsage = {
      remaining_day: remainingDay ? parseInt(remainingDay, 10) : 2000,
      remaining_minute: remainingMinute ? parseInt(remainingMinute, 10) : 40,
    };
    localStorage.setItem("api_usage", JSON.stringify(apiUsage));
    // Trigger storage event for other tabs
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "api_usage",
        newValue: JSON.stringify(apiUsage),
      })
    );
  }

  return response.json();
}

export async function fetchRoutes(
  origin: Coordinate,
  destinations: Destination[]
): Promise<Array<{ coordinates: Array<[number, number]> }>> {
  const response = await fetch(`${API_BASE}/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ origin, destinations }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Routes request failed");
  }

  return response.json();
}
