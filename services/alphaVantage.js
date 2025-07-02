import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Backend URL - for Android emulator use 10.0.2.2, for iOS simulator use localhost
const BACKEND_URL = __DEV__ 
  ? Platform.OS === 'android' 
    ? 'http://10.0.2.2:3001' 
    : 'http://localhost:3001'
  : 'https://your-production-backend.com'; // Replace with your production URL

console.log('🔧 [Config] Backend URL:', BACKEND_URL);

// Helper function to clear cache (now just for local cache, backend handles its own cache)
export async function clearCache() {
  try {
    console.log('🗑️ [Cache] Clearing local cache...');
    // Just a placeholder since backend handles caching now
  } catch (error) {
    console.error('❌ [Cache Error] Failed to clear cache:', error);
  }
}

export async function getTopGainersLosers() {
  console.log('🚀 [Backend API] Fetching Top Gainers/Losers from backend...');
  const url = `${BACKEND_URL}/api/stocks/top-gainers-losers`;
  console.log('📡 [API URL]:', url);
  
  try {
    console.log('🌐 [API] Making request to backend...');
    const response = await fetch(url);
    console.log('📊 [API Response] Status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ [API Response] Top Gainers/Losers data received from backend:', {
      top_gainers_count: data.top_gainers?.length || 0,
      top_losers_count: data.top_losers?.length || 0,
      last_updated: data.last_updated
    });
    
    return data;
  } catch (error) {
    console.error('❌ [API Error] Backend request failed:', error);
    console.error('❌ [API Error] Error details:', {
      message: error.message,
      url: url
    });
    throw error;
  }
}

export async function getCompanyOverview(symbol) {
  const url = `${BACKEND_URL}/api/stocks/overview/${symbol}`;
  console.log('🚀 [Backend API] Fetching Company Overview for:', symbol);
  console.log('📡 [API URL]:', url);
  
  try {
    console.log('🌐 [API] Making company overview request to backend...');
    const response = await fetch(url);
    console.log('📊 [API Response] Status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ [API Response] Company Overview received from backend:', {
      symbol: data.Symbol,
      name: data.Name,
      sector: data.Sector,
      industry: data.Industry,
      marketCap: data.MarketCapitalization,
      hasDescription: !!data.Description
    });
    
    return data;
  } catch (error) {
    console.error('❌ [API Error] Company Overview failed for', symbol, ':', error);
    throw error;
  }
}

export async function getQuote(symbol) {
  const url = `${BACKEND_URL}/api/stocks/quote/${symbol}`;
  console.log('🚀 [Backend API] Fetching Quote for:', symbol);
  console.log('📡 [API URL]:', url);
  
  try {
    console.log('🌐 [API] Making quote request to backend...');
    const response = await fetch(url);
    console.log('📊 [API Response] Status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ [API Response] Quote received from backend:', {
      symbol: data['01. symbol'],
      price: data['05. price'],
      change: data['09. change'],
      changePercent: data['10. change percent'],
      volume: data['06. volume']
    });
    
    return data;
  } catch (error) {
    console.error('❌ [API Error] Quote failed for', symbol, ':', error);
    throw error;
  }
}

export async function getIntradayData(symbol, interval = '60min') {
  const url = `${BACKEND_URL}/api/stocks/timeseries/TIME_SERIES_INTRADAY/${symbol}?interval=${interval}`;
  console.log('🚀 [Backend API] Fetching Intraday Data for:', symbol, 'Interval:', interval);
  console.log('📡 [API URL]:', url);
  
  try {
    console.log('🌐 [API] Making intraday request to backend...');
    const response = await fetch(url);
    console.log('📊 [API Response] Status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const timeSeriesKey = `Time Series (${interval})`;
    const timeSeries = data[timeSeriesKey];
    const dataPointsCount = timeSeries ? Object.keys(timeSeries).length : 0;
    
    console.log('✅ [API Response] Intraday data received from backend:', {
      symbol,
      interval,
      dataPoints: dataPointsCount,
      lastUpdated: data['Meta Data']?.['3. Last Refreshed']
    });
    
    return data;
  } catch (error) {
    console.error('❌ [API Error] Intraday data failed for', symbol, ':', error);
    throw error;
  }
}

export async function getDailyData(symbol) {
  const url = `${BACKEND_URL}/api/stocks/timeseries/TIME_SERIES_DAILY/${symbol}`;
  console.log('🚀 [Backend API] Fetching Daily Data for:', symbol);
  console.log('📡 [API URL]:', url);
  
  try {
    console.log('🌐 [API] Making daily data request to backend...');
    const response = await fetch(url);
    console.log('📊 [API Response] Status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const timeSeries = data['Time Series (Daily)'];
    const dataPointsCount = timeSeries ? Object.keys(timeSeries).length : 0;
    
    console.log('✅ [API Response] Daily data received from backend:', {
      symbol,
      dataPoints: dataPointsCount,
      lastUpdated: data['Meta Data']?.['3. Last Refreshed']
    });
    
    return data;
  } catch (error) {
    console.error('❌ [API Error] Daily data failed for', symbol, ':', error);
    throw error;
  }
}

export async function getWeeklyData(symbol) {
  const url = `${BACKEND_URL}/api/stocks/timeseries/TIME_SERIES_WEEKLY/${symbol}`;
  console.log('🚀 [Backend API] Fetching Weekly Data for:', symbol);
  console.log('📡 [API URL]:', url);
  
  try {
    console.log('🌐 [API] Making weekly data request to backend...');
    const response = await fetch(url);
    console.log('📊 [API Response] Status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const timeSeries = data['Weekly Time Series'];
    const dataPointsCount = timeSeries ? Object.keys(timeSeries).length : 0;
    
    console.log('✅ [API Response] Weekly data received from backend:', {
      symbol,
      dataPoints: dataPointsCount,
      lastUpdated: data['Meta Data']?.['3. Last Refreshed']
    });
    
    return data;
  } catch (error) {
    console.error('❌ [API Error] Weekly data failed for', symbol, ':', error);
    throw error;
  }
}

export async function getMonthlyData(symbol) {
  const url = `${BACKEND_URL}/api/stocks/timeseries/TIME_SERIES_MONTHLY/${symbol}`;
  console.log('🚀 [Backend API] Fetching Monthly Data for:', symbol);
  console.log('📡 [API URL]:', url);
  
  try {
    console.log('🌐 [API] Making monthly data request to backend...');
    const response = await fetch(url);
    console.log('📊 [API Response] Status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const timeSeries = data['Monthly Time Series'];
    const dataPointsCount = timeSeries ? Object.keys(timeSeries).length : 0;
    
    console.log('✅ [API Response] Monthly data received from backend:', {
      symbol,
      dataPoints: dataPointsCount,
      lastUpdated: data['Meta Data']?.['3. Last Refreshed']
    });
    
    return data;
  } catch (error) {
    console.error('❌ [API Error] Monthly data failed for', symbol, ':', error);
    throw error;
  }
}

export async function searchSymbols(keywords) {
  const url = `${BACKEND_URL}/api/stocks/search?keywords=${encodeURIComponent(keywords)}`;
  console.log('🚀 [Backend API] Searching symbols for:', keywords);
  console.log('📡 [API URL]:', url);
  
  try {
    console.log('🌐 [API] Making symbol search request to backend...');
    const response = await fetch(url);
    console.log('📊 [API Response] Status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }
    
    const results = await response.json();
    
    console.log('✅ [API Response] Symbol search results from backend:', {
      keywords,
      resultsCount: results.length,
      symbols: results.slice(0, 3).map(r => r['1. symbol']).join(', ')
    });
    
    return results;
  } catch (error) {
    console.error('❌ [API Error] Symbol search failed for', keywords, ':', error);
    throw error;
  }
}

// News Sentiment API
export const getNewsAndSentiment = async (options = {}) => {
  const {
    tickers = '',
    topics = '',
    timeFrom = '',
    timeTo = '',
    sort = 'LATEST',
    limit = 50
  } = options;

  console.log('🚀 [Backend API] Fetching News & Sentiment from backend...');
  
  try {
    let url = `${BACKEND_URL}/api/stocks/news-sentiment?`;
    
    const params = new URLSearchParams();
    if (tickers) params.append('tickers', tickers);
    if (topics) params.append('topics', topics);
    if (timeFrom) params.append('time_from', timeFrom);
    if (timeTo) params.append('time_to', timeTo);
    if (sort) params.append('sort', sort);
    if (limit) params.append('limit', limit);
    
    url += params.toString();

    console.log('📡 [API URL]:', url);
    console.log('🌐 [API] Making news request to backend...');
    
    const response = await fetch(url);
    console.log('📊 [API Response] Status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ [API Response] News data received from backend:', {
      items_count: data.items?.length || 0,
      has_sentiment_definition: !!data.sentiment_score_definition
    });
    
    return data;
  } catch (error) {
    console.error('❌ [API Error] News request failed:', error);
    console.error('❌ [API Error] Error details:', {
      message: error.message,
      url: `${BACKEND_URL}/api/stocks/news-sentiment`
    });
    throw error;
  }
};

// Get news by specific topics
export const getNewsByTopic = async (topic, limit = 20) => {
  return await getNewsAndSentiment({
    topics: topic,
    limit,
    sort: 'LATEST'
  });
};

// Get news for specific tickers
export const getNewsByTickers = async (tickers, limit = 20) => {
  return await getNewsAndSentiment({
    tickers,
    limit,
    sort: 'LATEST'
  });
}; 