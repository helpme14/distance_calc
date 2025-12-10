# Distance + ETA Calculator

A modern, responsive web application for calculating driving distances and estimated travel times using real-world routing data. Built with React, TypeScript, Vite, and OpenRouteService API. Features interactive map selection with support for the Philippines as the default location.

## Features

- 🗺️ **Interactive Map Selection** - Click on the map to select origin and destination points
- 📍 **Philippines Default** - Map defaults to Metro Manila area for easy local routing
- ⚡ **Real-time Calculations** - Get instant distance and ETA using OpenRouteService
- 🎯 **Multiple Destinations** - Add multiple stops and calculate distances to all
- 💾 **Full Route Visualization** - See all your routes plotted on the map
- 📊 **Summary View** - Quick overview of all distances and travel times

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Mapping:** Leaflet, React-Leaflet
- **Backend:** Express.js (proxy for routing API)
- **Routing API:** OpenRouteService (Free Tier)

## OpenRouteService API Limits

### Free Tier Rate Limits

- **Per Day Max Requests:** 40,000
- **Per Minute Max Requests:** 40
- **Max Locations per Request:** 2,500

### Documentation

- API Docs: https://openrouteservice.org/dev/#/api-docs/v2/matrix/post
- Pricing Plans: https://openrouteservice.org/plans/

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Free OpenRouteService API key

### Setup

1. **Get an API Key** (if you haven't already)

   ```bash
   # Visit https://openrouteservice.org/sign-up/ and create a free account
   # Copy your API key
   ```

2. **Clone and Install**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the project root:

   ```
   ORS_API_KEY=your_api_key_here
   VITE_API_BASE=http://localhost:4173/api
   PORT=4173
   ```

4. **Run Development Server**

   ```bash
   npm run dev:full
   ```

   This starts both the frontend (Vite on port 5173) and backend server (Express on port 4173)

5. **Build for Production**
   ```bash
   npm run build
   ```

## Usage

1. **Set Origin Point**

   - Toggle "Origin" mode in the header
   - Click on the map to select your starting point
   - Or manually enter coordinates in the form

2. **Add Destinations**

   - Toggle "Destination" mode in the header
   - Click on the map to add each destination
   - Optionally label each stop (e.g., "Stop 1", "Client A")

3. **Calculate Routes**

   - Click "Calculate distances" button
   - View results in the summary section below
   - See polylines connecting origin to each destination on the map

4. **View Results**
   - Distance in kilometers
   - Estimated travel time
   - Total for all routes

## Project Structure

```
src/
├── components/
│   ├── DestinationForm.tsx    # Add destinations form
│   ├── DestinationList.tsx    # List of all destinations
│   ├── Header.tsx             # App header with mode switcher
│   ├── MapView.tsx            # Interactive Leaflet map (defaults to Philippines)
│   ├── OriginForm.tsx         # Set origin coordinates
│   └── Summary.tsx            # Results summary display
├── services/
│   └── api.ts                 # Frontend API client
├── types.ts                   # TypeScript type definitions
├── App.tsx                    # Main app component
└── main.tsx                   # React entry point

server/
└── index.js                   # Express backend (ORS proxy with rate limit info)

public/                        # Static assets
```

## Map Configuration

The map defaults to the Philippines with the following coordinates:

- **Center:** 12.8797°N, 121.774°E (Metro Manila area)
- **Default Zoom:** 7 (full country view)
- **Zoom on Origin:** 8 (for better detail when origin is selected)

To change the default location, edit `src/components/MapView.tsx`:

```typescript
const center: Coordinate = origin || { lat: 12.8797, lng: 121.774 };
```

## API Integration

### Backend API Endpoints

- **POST `/api/matrix`** - Calculate distances between points

  ```json
  Request:
  {
    "origin": { "lat": 14.6091, "lng": 121.0223 },
    "destinations": [
      { "id": "1", "label": "Stop 1", "lat": 14.5995, "lng": 120.9842 }
    ]
  }

  Response:
  {
    "distances": [15.32],      // in kilometers
    "durations": [1245]        // in seconds
  }
  ```

### Environment Variables

| Variable        | Required | Description                               |
| --------------- | -------- | ----------------------------------------- |
| `ORS_API_KEY`   | Yes      | Your OpenRouteService API key             |
| `VITE_API_BASE` | No       | Backend API base URL (defaults to `/api`) |
| `PORT`          | No       | Server port (defaults to 4173)            |

## Development

```bash
# Install dependencies
npm install

# Run frontend + backend concurrently
npm run dev:full

# Run frontend only
npm run dev

# Run backend only
npm run server

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Rate Limiting Considerations

With the free tier (40,000 requests/day):

- **Single Route:** ~1 API call
- **Multiple Destinations:** Calculated as a batch (1 API call for all)
- **Per Day Capacity:** Can run ~40,000 single route calculations

### Optimization Tips

- Batch requests when possible (the app does this automatically)
- Reuse results when doing repeated calculations
- Consider upgrading plan if you exceed 40k daily requests

## Troubleshooting

### "Server missing ORS_API_KEY"

- Make sure `.env` file has `ORS_API_KEY=your_key_here`
- Restart the server after changing `.env`
- Check API key is valid at https://openrouteservice.org/

### "Failed to reach OpenRouteService"

- Check internet connection
- Verify API key is active/valid
- Check rate limits haven't been exceeded
- Monitor OpenRouteService dashboard for errors

### Map not showing Philippines

- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check that MapView.tsx has correct coordinates

## License

MIT

## Support

For issues with:

- **This App:** Check GitHub issues
- **OpenRouteService:** https://openrouteservice.org/support/
- **Leaflet Map:** https://leafletjs.com/
  import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
