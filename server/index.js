import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4173;
const ORS_API_KEY = process.env.ORS_API_KEY;

// ===== OpenRouteService API Rate Limits =====
// Per Day Max Requests: 2,000 (check your account at https://account.heigit.org/manage/key)
// Per Minute Max Requests: 40 (may vary based on subscription)
// Matrix API Reference: https://openrouteservice.org/dev/#/api-docs/v2/matrix/post
// Full Documentation: https://openrouteservice.org/plans/
// Get your API key at: https://account.heigit.org/manage/key
// ================================================

if (!ORS_API_KEY) {
  console.warn(
    "[warn] ORS_API_KEY is not set. Requests to /api/matrix will fail until you add it to .env"
  );
  console.warn(
    "[info] To use OpenRouteService, get a free API key at: https://openrouteservice.org/sign-up/"
  );
}

app.use(
  cors({
    exposedHeaders: [
      "x-ratelimit-remaining",
      "x-ratelimit-limit",
      "x-ratelimit-reset",
    ],
  })
);
app.use(express.json());

app.post("/api/matrix", async (req, res) => {
  const { origin, destinations, travelMode } = req.body || {};
  const mode = travelMode || "driving-car";

  if (!origin || !Array.isArray(destinations) || destinations.length === 0) {
    return res
      .status(400)
      .json({ message: "origin and destinations are required" });
  }
  if (!ORS_API_KEY) {
    return res.status(500).json({ message: "Server missing ORS_API_KEY" });
  }

  const locations = [origin, ...destinations].map((point) => [
    Number(point.lng),
    Number(point.lat),
  ]);

  const body = {
    locations,
    metrics: ["distance", "duration"],
    units: "km",
  };

  try {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/matrix/${mode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ORS_API_KEY,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("[ors] error response", response.status, text);
      return res
        .status(response.status)
        .json({ message: "OpenRouteService error", detail: text });
    }

    const data = await response.json();
    // distances/durations come back as a square matrix
    const distances = data.distances?.[0]?.slice(1) || [];
    const durations = data.durations?.[0]?.slice(1) || [];

    // Extract rate limit info from ORS response headers
    const remainingDay =
      response.headers.get("x-ratelimit-remaining") || "40000";
    const remainingMinute = response.headers.get("x-ratelimit-limit") || "40";

    // Include rate limit info in response headers (use lowercase for consistency)
    res.set({
      "x-ratelimit-remaining": remainingDay,
      "x-ratelimit-limit": remainingMinute,
    });

    res.json({ distances, durations });
  } catch (error) {
    console.error("[ors] request failed", error);
    res.status(500).json({
      message: "Failed to reach OpenRouteService",
      detail: error?.message,
    });
  }
});

app.post("/api/routes", async (req, res) => {
  const { origin, destinations, travelMode } = req.body || {};
  const mode = travelMode || "driving-car";

  if (!origin || !Array.isArray(destinations) || destinations.length === 0) {
    return res
      .status(400)
      .json({ message: "origin and destinations are required" });
  }
  if (!ORS_API_KEY) {
    return res.status(500).json({ message: "Server missing ORS_API_KEY" });
  }

  try {
    // Fetch routes for each destination from origin
    const routePromises = destinations.map((dest) =>
      fetch(`https://api.openrouteservice.org/v2/directions/${mode}/geojson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ORS_API_KEY,
        },
        body: JSON.stringify({
          coordinates: [
            [origin.lng, origin.lat],
            [dest.lng, dest.lat],
          ],
        }),
      })
    );

    const responses = await Promise.all(routePromises);
    const routes = [];
    let rateLimit = null;

    for (const response of responses) {
      if (!response.ok) {
        console.error("[ors] route fetch failed", response.status);
        continue;
      }
      // Capture rate limit headers from first successful response
      if (!rateLimit) {
        rateLimit = {
          day: response.headers.get("x-ratelimit-remaining") || "40000",
          minute: response.headers.get("x-ratelimit-limit") || "40",
        };
      }
      const data = await response.json();
      const coordinates = data.features?.[0]?.geometry?.coordinates || [];
      routes.push({ coordinates });
    }

    // Forward rate limit headers to client
    if (rateLimit) {
      res.set({
        "x-ratelimit-remaining": rateLimit.day,
        "x-ratelimit-limit": rateLimit.minute,
      });
    }

    res.json(routes);
  } catch (error) {
    console.error("[ors] routes request failed", error);
    res.status(500).json({
      message: "Failed to fetch routes",
      detail: error?.message,
    });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
