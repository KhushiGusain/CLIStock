import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WatchlistContext = createContext();
const WATCHLISTS_STORAGE_KEY = '@stocksApp_watchlists';

export function WatchlistProvider({ children }) {
  const [watchlists, setWatchlists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default watchlists if none exist in storage
  const defaultWatchlists = [
    { name: 'Watchlist 1', selected: true, stocks: [] },
    { name: 'Watchlist 2', selected: false, stocks: [] },
  ];

  // Load watchlists from AsyncStorage on component mount
  useEffect(() => {
    loadWatchlists();
  }, []);

  // Save watchlists to AsyncStorage whenever watchlists change
  useEffect(() => {
    if (!isLoading && watchlists.length > 0) {
      saveWatchlists(watchlists);
    }
  }, [watchlists, isLoading]);

  const loadWatchlists = async () => {
    try {
      const storedWatchlists = await AsyncStorage.getItem(WATCHLISTS_STORAGE_KEY);
      if (storedWatchlists) {
        const parsedWatchlists = JSON.parse(storedWatchlists);
        setWatchlists(parsedWatchlists);
      } else {
        // If no stored watchlists, use defaults
        setWatchlists(defaultWatchlists);
      }
    } catch (error) {
      console.error('Error loading watchlists:', error);
      // Fallback to default watchlists on error
      setWatchlists(defaultWatchlists);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWatchlists = async (watchlistsToSave) => {
    try {
      await AsyncStorage.setItem(WATCHLISTS_STORAGE_KEY, JSON.stringify(watchlistsToSave));
    } catch (error) {
      console.error('Error saving watchlists:', error);
    }
  };

  const updateWatchlists = (newWatchlists) => {
    setWatchlists(newWatchlists);
  };

  const removeStockFromWatchlist = (watchlistName, stockSymbol) => {
    setWatchlists(prevWatchlists => 
      prevWatchlists.map(watchlist => {
        if (watchlist.name === watchlistName) {
          return {
            ...watchlist,
            stocks: watchlist.stocks.filter(stock => 
              (stock.ticker || stock.symbol) !== stockSymbol
            )
          };
        }
        return watchlist;
      })
    );
  };

  const clearWatchlists = async () => {
    try {
      await AsyncStorage.removeItem(WATCHLISTS_STORAGE_KEY);
      setWatchlists(defaultWatchlists);
    } catch (error) {
      console.error('Error clearing watchlists:', error);
    }
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlists, 
      setWatchlists: updateWatchlists,
      removeStockFromWatchlist,
      isLoading,
      clearWatchlists
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlists() {
  return useContext(WatchlistContext);
} 