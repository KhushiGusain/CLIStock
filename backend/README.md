# Stock API Backend

A caching backend server for Alpha Vantage stock data to solve rate limiting issues.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

3. **Server will run on:** `http://localhost:3001`

## 📊 API Endpoints

- `GET /api/stocks/top-gainers-losers` - Top gainers and losers (cached 5 min)
- `GET /api/stocks/overview/:symbol` - Company overview (cached 24 hours)
- `GET /api/stocks/quote/:symbol` - Real-time quote (cached 1 min)
- `GET /api/stocks/timeseries/:function/:symbol` - Chart data (cached 15 min)
- `GET /api/stocks/search?keywords=AAPL` - Symbol search
- `GET /api/health` - Health check with cache stats

## ⚡ Caching Strategy

| Data Type | Cache Duration | Reason |
|-----------|----------------|---------|
| Top Gainers/Losers | 5 minutes | Updates frequently |
| Company Overview | 24 hours | Rarely changes |
| Real-time Quotes | 1 minute | Near real-time needed |
| Chart Data | 15 minutes | Balance of freshness/performance |

## 🎯 Benefits

- **1 Alpha Vantage call → serves 100+ app requests**
- **Stay within 25 API calls/day limit**
- **Better error handling and fallbacks**
- **Consistent performance for all users**

## 🔧 Configuration

Update your Alpha Vantage API key in `server.js`:
```javascript
const ALPHA_VANTAGE_API_KEY = 'your_api_key_here';
```

## 📱 React Native Setup

The React Native app automatically detects the backend:
- **Android Emulator:** `http://10.0.2.2:3001`
- **iOS Simulator:** `http://localhost:3001`

## 🔍 Monitoring

Check backend health and cache status:
```bash
curl http://localhost:3001/api/health
```

Example response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "cache_stats": {
    "topGainersLosers": {
      "cached": true,
      "lastFetch": "2024-01-01T11:55:00.000Z"
    },
    "companyOverviews": 5,
    "quotes": 3,
    "timeSeries": 12
  }
}
```

## 🚀 Production Deployment

For production, update the `BACKEND_URL` in your React Native app's `services/alphaVantage.js`:

```javascript
const BACKEND_URL = 'https://your-production-backend.com';
```

Consider using:
- **Heroku, Vercel, Railway** for easy deployment
- **Redis** for persistent caching across server restarts
- **Environment variables** for API keys
- **Rate limiting** to prevent abuse 