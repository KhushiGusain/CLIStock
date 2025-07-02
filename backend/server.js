const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

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

const ALPHA_VANTAGE_API_KEY = '29RSVT4XO457J6NZ'; // we can use .env file to store the api key but for easier presentation we are using it here

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

// NEWS & SENTIMENT ENDPOINT
app.get('/api/stocks/news-sentiment', async (req, res) => {
  console.log('📊 [Backend] Request for News & Sentiment');
  
  const now = Date.now();
  const { tickers, topics, time_from, time_to, sort, limit } = req.query;
  
  if (!cachedData.newsSentiment || !isCacheValid(lastFetch.newsSentiment, NEWS_CACHE_DURATION)) {
    console.log('🌐 [Backend] Fetching fresh news data from Alpha Vantage...');
    
    try {
      // QUERY PARAMETERS
      let url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${ALPHA_VANTAGE_API_KEY}`;
      if (tickers) url += `&tickers=${tickers}`;
      if (topics) url += `&topics=${topics}`;
      if (time_from) url += `&time_from=${time_from}`;
      if (time_to) url += `&time_to=${time_to}`;
      if (sort) url += `&sort=${sort}`;
      if (limit) url += `&limit=${limit}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // VALIDATION
      if (data.feed) {
        // NORMALIZE THE RESPONSE STRUCTURE TO MATCH OUR FRONTEND EXPECTATIONS
        const normalizedData = {
          items: data.feed, // Convert 'feed' to 'items'
          sentiment_score_definition: data.sentiment_score_definition,
          relevance_score_definition: data.relevance_score_definition
        };
        
        cachedData.newsSentiment = normalizedData;
        lastFetch.newsSentiment = now;
        console.log('✅ [Backend] News data cached successfully');
        console.log(`📊 [Backend] Cached ${data.feed.length} news articles`);
      } else {
        console.error('⚠️ [Backend] Invalid news data from Alpha Vantage:', data);
        if (cachedData.newsSentiment) {
          console.log('📱 [Backend] Serving stale cached news data');
          return res.json(cachedData.newsSentiment);
        }
        return res.json(getMockNewsData());
      }
    } catch (error) {
      console.error('❌ [Backend] Error fetching news from Alpha Vantage:', error);
      
      if (cachedData.newsSentiment) {
        console.log('📱 [Backend] Serving stale cached news data due to API error');
        return res.json(cachedData.newsSentiment);
      }
      
      console.log('📱 [Backend] Serving mock news data due to API error');
      return res.json(getMockNewsData());
    }
  } else {
    console.log('📱 [Backend] Serving cached news data');
  }
  
  res.json(cachedData.newsSentiment);
});

  // MOCK NEWS DATA copied from API RESPONSE JSON
function getMockNewsData() {
  return {
    items: [
      {
        title: "Tech Stocks Rally as AI Revolution Continues",
        url: "https://example.com/news1",
        time_published: "20241201T143000",
        authors: ["Financial Reporter"],
        summary: "Major technology stocks surge as artificial intelligence adoption accelerates across industries, with investors showing renewed confidence in the sector.",
        banner_image: null,
        source: "Financial News Network",
        category_within_source: "Technology",
        source_domain: "financialnews.com",
        topics: [
          {
            topic: "Technology",
            relevance_score: "0.8"
          }
        ],
        overall_sentiment_score: 0.7,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: [
          {
            ticker: "AAPL",
            relevance_score: "0.9",
            ticker_sentiment_score: "0.8",
            ticker_sentiment_label: "Bullish"
          }
        ]
      },
      {
        title: "Federal Reserve Signals Potential Rate Changes",
        url: "https://example.com/news2", 
        time_published: "20241201T120000",
        authors: ["Economic Analyst"],
        summary: "The Federal Reserve indicates possible adjustments to interest rates in response to changing economic conditions and inflation targets.",
        banner_image: null,
        source: "Economic Times",
        category_within_source: "Economics",
        source_domain: "economictimes.com",
        topics: [
          {
            topic: "Economy - Monetary Policy",
            relevance_score: "0.9"
          }
        ],
        overall_sentiment_score: 0.1,
        overall_sentiment_label: "Neutral",
        ticker_sentiment: []
      },
      {
        title: "Electric Vehicle Market Shows Strong Growth",
        url: "https://example.com/news3",
        time_published: "20241201T100000", 
        authors: ["Auto Industry Reporter"],
        summary: "Electric vehicle manufacturers report record sales figures as consumer adoption accelerates and charging infrastructure expands nationwide.",
        banner_image: null,
        source: "Auto News Daily",
        category_within_source: "Automotive",
        source_domain: "autonews.com",
        topics: [
          {
            topic: "Energy & Transportation",
            relevance_score: "0.85"
          }
        ],
        overall_sentiment_score: 0.6,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: [
          {
            ticker: "TSLA",
            relevance_score: "0.8",
            ticker_sentiment_score: "0.7",
            ticker_sentiment_label: "Bullish"
          }
        ]
      },
      {
        title: "Healthcare Sector Sees Major Breakthrough",
        url: "https://example.com/news4",
        time_published: "20241130T180000",
        authors: ["Health Reporter"],
        summary: "Pharmaceutical companies announce significant advances in drug development, leading to positive market reactions and increased investor interest.",
        banner_image: null,
        source: "Health Business Journal",
        category_within_source: "Healthcare",
        source_domain: "healthbiz.com",
        topics: [
          {
            topic: "Life Sciences",
            relevance_score: "0.9"
          }
        ],
        overall_sentiment_score: 0.8,
        overall_sentiment_label: "Bullish",
        ticker_sentiment: [
          {
            ticker: "JNJ",
            relevance_score: "0.7",
            ticker_sentiment_score: "0.6",
            ticker_sentiment_label: "Bullish"
          }
        ]
      }
    ],
    sentiment_score_definition: "x <= -0.35: Bearish; -0.35 < x <= -0.15: Somewhat-Bearish; -0.15 < x < 0.15: Neutral; 0.15 <= x < 0.35: Somewhat-Bullish; x >= 0.35: Bullish"
  };
}

// SYMBOL SEARCH ENDPOINT
app.get('/api/stocks/search', async (req, res) => {
  const { keywords } = req.query;
  
  if (!keywords) {
    return res.status(400).json({ error: 'Keywords parameter is required' });
  }
  
  console.log(`📊 [Backend] Search request for: ${keywords}`);
  
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ [Backend] Search results for "${keywords}": ${data.bestMatches?.length || 0} results`);
    res.json(data.bestMatches || []);
  } catch (error) {
    console.error(`❌ [Backend] Error searching for "${keywords}":`, error);
    res.status(502).json({ error: 'Failed to search symbols' });
  }
});

// HEALTH CHECK ENDPOINT
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cache_stats: {
      topGainersLosers: {
        cached: !!cachedData.topGainersLosers,
        lastFetch: lastFetch.topGainersLosers ? new Date(lastFetch.topGainersLosers).toISOString() : null
      },
      newsSentiment: {
        cached: !!cachedData.newsSentiment,
        lastFetch: lastFetch.newsSentiment ? new Date(lastFetch.newsSentiment).toISOString() : null
      },
      companyOverviews: cachedData.companyOverviews.size,
      quotes: cachedData.quotes.size,
      timeSeries: cachedData.timeSeries.size
    }
  });
});

// START SERVER LOGS FOR EASY DEBUGGING
app.listen(PORT, () => {
  console.log(`🚀 [Backend] Stock API server running on port ${PORT}`);
  console.log(`📊 [Backend] Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 [Backend] API endpoints:`);
  console.log(`   GET /api/stocks/top-gainers-losers`);
  console.log(`   GET /api/stocks/overview/:symbol`);
  console.log(`   GET /api/stocks/quote/:symbol`);
  console.log(`   GET /api/stocks/timeseries/:function/:symbol`);
  console.log(`   GET /api/stocks/news-sentiment`);
  console.log(`   GET /api/stocks/search?keywords=AAPL`);
});

module.exports = app; 