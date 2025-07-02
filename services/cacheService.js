import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTopGainersLosers } from './alphaVantage';

const CACHE_DURATION = 6 * 60 * 60 * 1000; //6HRS
const CACHE_KEY = 'top_gainers_losers_cache';

class CacheService {
  /**
   * Get cached data from AsyncStorage
   * @returns {Promise<Object|null>} 
   */
  async getCachedData() {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) {
        console.log('[Cache] No cached data found');
        return null;
      }

      const parsedCache = JSON.parse(cached);
      const now = Date.now();
      const cacheAge = now - parsedCache.timestamp;

      if (cacheAge > CACHE_DURATION) {
        console.log(' [Cache] Cached data expired, age:', Math.round(cacheAge / (60 * 1000)), 'minutes');
        await AsyncStorage.removeItem(CACHE_KEY);
        return null;
      }

      console.log(' [Cache] Using cached data, age:', Math.round(cacheAge / (60 * 1000)), 'minutes');
      return parsedCache.data;
    } catch (error) {
      console.error(' [Cache] Error reading cache:', error);
      return null;
    }
  }

  /**
   * Store data in AsyncStorage with timestamp
   * @param {Object} data - TOP G/L CACHE
   */
  async setCachedData(data) {
    try {
      const cacheObject = {
        data: data,
        timestamp: Date.now()
      };
      
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
      console.log(' [Cache] Data cached successfully');
    } catch (error) {
      console.error(' [Cache] Error caching data:', error);
    }
  }

  /**
   * Get top gainers/losers data - checks cache first, then fetches if needed
   * @returns {Promise<Object>} TOP G/L DATA
   */
  async getTopGainersLosers() {
    // First check if we have valid cached data
    const cachedData = await this.getCachedData();
    if (cachedData) {
      return cachedData;
    }

    // NO VALID CACHE, FETCH FROM BACKEND
    console.log(' [Cache] Fetching fresh data from backend...');
    try {
      const freshData = await getTopGainersLosers();
      
      // FRESH CACHE
      await this.setCachedData(freshData);
      
      return freshData;
    } catch (error) {
      console.error(' [Cache] Error fetching fresh data:', error);
      throw error;
    }
  }

  /**
   * @returns {Promise<Object>} FRESH TOP G/L DATA
   */
  async refreshTopGainersLosers() {
    console.log(' [Cache] Force refreshing data from backend...');
    try {
      const freshData = await getTopGainersLosers();
      
      // FRESH CACHE
      await this.setCachedData(freshData);
      
      console.log(' [Cache] Data refreshed and cached successfully');
      return freshData;
    } catch (error) {
      console.error(' [Cache] Error refreshing data:', error);
      throw error;
    }
  }

  /**
   * CLEAR CACHE MANUALLY
   */
  async clearCache() {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      console.log(' [Cache] Cache cleared successfully');
    } catch (error) {
      console.error(' [Cache] Error clearing cache:', error);
    }
  }

  /**
   * @returns {Promise<Object>} CACHE INFO
   */
  async getCacheInfo() {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) {
        return { exists: false };
      }

      const parsedCache = JSON.parse(cached);
      const now = Date.now();
      const cacheAge = now - parsedCache.timestamp;
      const isExpired = cacheAge > CACHE_DURATION;

      return {
        exists: true,
        timestamp: parsedCache.timestamp,
        ageMinutes: Math.round(cacheAge / (60 * 1000)),
        isExpired: isExpired,
        expiresInMinutes: isExpired ? 0 : Math.round((CACHE_DURATION - cacheAge) / (60 * 1000))
      };
    } catch (error) {
      console.error(' [Cache] Error getting cache info:', error);
      return { exists: false, error: error.message };
    }
  }
}

export default new CacheService(); 