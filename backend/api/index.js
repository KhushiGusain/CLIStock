const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

app.use(cors());
app.use(express.json());

// CACHE CONFIGURATION
let cachedData = {
  topGainersLosers: null,
  companyOverviews: new Map(),
  quotes: new Map(),
  timeSeries: new Map(),
  newsSentiment: null,
};

let lastFetch = {
  topGainersLosers: 0,
  companyOverviews: new Map(),
  quotes: new Map(),
  timeSeries: new Map(),
  newsSentiment: 0,
};

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6HR
const COMPANY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24HRS as company info doesn't change often so we can cache it for a day
const QUOTE_CACHE_DURATION = 1 * 60 * 1000; // 1MINUTE for quotes
const TIMESERIES_CACHE_DURATION = 15 * 60 * 1000; // 15MINUTES for chart data
const NEWS_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6HOURS for news

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || '29RSVT4XO457J6NZ';

function isCacheValid(timestamp, duration) {
  return timestamp && (Date.now() - timestamp < duration);
}

// Top G/L endpoint
app.get('/api/stocks/top-gainers-losers', async (req, res) => {
  console.log('📊 [Backend] Request for Top Gainers/Losers');
  
  const now = Date.now();
  
  if (!cachedData.topGainersLosers || !isCacheValid(lastFetch.topGainersLosers, CACHE_DURATION)) {
    console.log('🌐 [Backend] Fetching fresh data from Alpha Vantage...');
    
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // VALIDATION
      if (data.top_gainers && data.top_losers) {
        cachedData.topGainersLosers = data;
        lastFetch.topGainersLosers = now;
        console.log('✅ [Backend] Fresh data cached successfully');
      } else {
        console.error('⚠️ [Backend] Invalid data from Alpha Vantage:', data);
        return res.status(502).json({ error: 'Invalid data from Alpha Vantage' });
      }
    } catch (error) {
      console.error('❌ [Backend] Error fetching from Alpha Vantage:', error);
      
      // IF CACHED DATA, SERVE IT EVEN IF EXPIRED
      if (cachedData.topGainersLosers) {
        console.log('📱 [Backend] Serving stale cached data due to API error');
        return res.json(cachedData.topGainersLosers);
      }
      
      return res.status(502).json({ error: 'Failed to fetch data from Alpha Vantage' });
    }
  } else {
    console.log('📱 [Backend] Serving cached data');
  }
  
  res.json(cachedData.topGainersLosers);
});

// COMPANY DATA ENDPOINT
app.get('/api/stocks/overview/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  console.log(`📊 [Backend] Request for company overview: ${symbol}`);
  
  const now = Date.now();
  
  if (!cachedData.companyOverviews.has(symbol) || !isCacheValid(lastFetch.companyOverviews.get(symbol), COMPANY_CACHE_DURATION)) {
    console.log(`🌐 [Backend] Fetching fresh overview for ${symbol}...`);
    
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // VALIDATION
      if (data.Symbol) {
        cachedData.companyOverviews.set(symbol, data);
        lastFetch.companyOverviews.set(symbol, now);
        console.log(`✅ [Backend] Overview for ${symbol} cached successfully`);
      } else {
        console.error(`⚠️ [Backend] Invalid overview data for ${symbol}:`, data);
        return res.status(404).json({ error: `No data found for symbol ${symbol}` });
      }
    } catch (error) {
      console.error(`❌ [Backend] Error fetching overview for ${symbol}:`, error);
      return res.status(502).json({ error: 'Failed to fetch company overview' });
    }
  } else {
    console.log(`📱 [Backend] Serving cached overview for ${symbol}`);
  }
  
  res.json(cachedData.companyOverviews.get(symbol));
});

// PRICE ENDPOINT
app.get('/api/stocks/quote/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  console.log(`📊 [Backend] Request for quote: ${symbol}`);
  
  const now = Date.now();
  
  if (!cachedData.quotes.has(symbol) || !isCacheValid(lastFetch.quotes.get(symbol), QUOTE_CACHE_DURATION)) {
    console.log(`🌐 [Backend] Fetching fresh quote for ${symbol}...`);
    
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }
      
      const data = await response.json();
      const quote = data['Global Quote'];
      
      if (quote && quote['01. symbol']) {
        cachedData.quotes.set(symbol, quote);
        lastFetch.quotes.set(symbol, now);
        console.log(`✅ [Backend] Quote for ${symbol} cached successfully`);
      } else {
        console.error(`⚠️ [Backend] Invalid quote data for ${symbol}:`, data);
        return res.status(404).json({ error: `No quote data found for symbol ${symbol}` });
      }
    } catch (error) {
      console.error(`❌ [Backend] Error fetching quote for ${symbol}:`, error);
      return res.status(502).json({ error: 'Failed to fetch quote data' });
    }
  } else {
    console.log(`📱 [Backend] Serving cached quote for ${symbol}`);
  }
  
  res.json(cachedData.quotes.get(symbol));
});

// CHART ENDPOINT
app.get('/api/stocks/timeseries/:function/:symbol', async (req, res) => {
  const { function: timeFunction, symbol } = req.params;
  const { interval } = req.query;
  const symbolUpper = symbol.toUpperCase();
  
  // CACHE KEY
  const cacheKey = interval ? `${timeFunction}_${symbolUpper}_${interval}` : `${timeFunction}_${symbolUpper}`;
  
  console.log(`📊 [Backend] Request for time series: ${cacheKey}`);
  
  const now = Date.now();
  
  if (!cachedData.timeSeries.has(cacheKey) || !isCacheValid(lastFetch.timeSeries.get(cacheKey), TIMESERIES_CACHE_DURATION)) {
    console.log(`🌐 [Backend] Fetching fresh time series for ${cacheKey}...`);
    
    try {
      let url = `https://www.alphavantage.co/query?function=${timeFunction}&symbol=${symbolUpper}&apikey=${ALPHA_VANTAGE_API_KEY}`;
      if (interval) {
        url += `&interval=${interval}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // VALIDATION
      const hasValidData = data['Meta Data'] || data['Time Series (Daily)'] || data['Weekly Time Series'] || data['Monthly Time Series'] || data[`Time Series (${interval})`];
      
      if (hasValidData) {
        cachedData.timeSeries.set(cacheKey, data);
        lastFetch.timeSeries.set(cacheKey, now);
        console.log(`✅ [Backend] Time series for ${cacheKey} cached successfully`);
      } else {
        console.error(`⚠️ [Backend] Invalid time series data for ${cacheKey}:`, data);
        return res.status(404).json({ error: `No time series data found for ${cacheKey}` });
      }
    } catch (error) {
      console.error(`❌ [Backend] Error fetching time series for ${cacheKey}:`, error);
      return res.status(502).json({ error: 'Failed to fetch time series data' });
    }
  } else {
    console.log(`📱 [Backend] Serving cached time series for ${cacheKey}`);
  }
  
  res.json(cachedData.timeSeries.get(cacheKey));
});

// NEWS ENDPOINT
app.get('/api/stocks/news', async (req, res) => {
  console.log('📊 [Backend] Request for news sentiment');
  
  const now = Date.now();
  
  if (!cachedData.newsSentiment || !isCacheValid(lastFetch.newsSentiment, NEWS_CACHE_DURATION)) {
    console.log('🌐 [Backend] Fetching fresh news data...');
    
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${ALPHA_VANTAGE_API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // VALIDATION
      if (data.feed && Array.isArray(data.feed)) {
        cachedData.newsSentiment = data;
        lastFetch.newsSentiment = now;
        console.log('✅ [Backend] News data cached successfully');
      } else {
        console.error('⚠️ [Backend] Invalid news data:', data);
        return res.status(502).json({ error: 'Invalid news data from Alpha Vantage' });
      }
    } catch (error) {
      console.error('❌ [Backend] Error fetching news:', error);
      
      // IF CACHED DATA, SERVE IT EVEN IF EXPIRED
      if (cachedData.newsSentiment) {
        console.log('📱 [Backend] Serving stale cached news due to API error');
        return res.json(cachedData.newsSentiment);
      }
      
      return res.status(502).json({ error: 'Failed to fetch news data' });
    }
  } else {
    console.log('📱 [Backend] Serving cached news data');
  }
  
  res.json(cachedData.newsSentiment);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stock API Backend is running' });
});

// Export for Vercel
module.exports = app; 