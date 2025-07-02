import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useWatchlists } from '../WatchlistContext';
import { useTheme } from '../ThemeContext';
import { getStockIcon } from '../services/stockIconService';
import { getQuote } from '../services/alphaVantage';

const BACK_ARROW = require('../assets/vectors/backArrow.png');
const UP_ARROW = require('../assets/vectors/upArrow.png');
const DOWN_ARROW = require('../assets/vectors/downArrow.png');

export default function WatchlistStocksScreen({ route }) {
  const navigation = useNavigation();
  const { watchlists, removeStockFromWatchlist, isLoading } = useWatchlists();
  const { theme } = useTheme();
  const { watchlistName } = route.params || {};
  const watchlist = watchlists.find(w => w.name === watchlistName);
  const stocks = watchlist?.stocks || [];

  const [stocksWithPrices, setStocksWithPrices] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(false);

    // Fetch current prices for all stocks in the watchlist
  const fetchStockPrices = async () => {
    if (stocks.length === 0) {
      setStocksWithPrices([]);
      return;
    }

    setLoadingPrices(true);
    const enrichedStocks = [];

    for (const stock of stocks) {
      try {
        const symbol = stock.symbol || stock.ticker;
        const quote = await getQuote(symbol);
        
        let enrichedStock = { ...stock };
        
        if (quote && !quote.error) {
          const currentPrice = parseFloat(quote['05. price'] || 0);
          const change = parseFloat(quote['09. change'] || 0);
          const changePercent = quote['10. change percent']?.replace('%', '') || '0';
          
          enrichedStock = {
            ...stock,
            currentPrice: currentPrice,
            change: change,
            changePercent: changePercent,
            hasRealData: true
          };
        } else {
          const samplePrice = getSamplePrice(symbol);
          const sampleChange = getSampleChange(symbol);
          const sampleChangePercent = getSampleChangePercent(symbol);
          
          enrichedStock = {
            ...stock,
            currentPrice: parseFloat(samplePrice),
            change: parseFloat(sampleChange),
            changePercent: sampleChangePercent,
            hasRealData: false
          };
        }
        
        enrichedStocks.push(enrichedStock);
      } catch (error) {
        console.error(`Error fetching price for ${stock.symbol || stock.ticker}:`, error);
        const symbol = stock.symbol || stock.ticker;
        enrichedStocks.push({
          ...stock,
          currentPrice: parseFloat(getSamplePrice(symbol)),
          change: parseFloat(getSampleChange(symbol)),
          changePercent: getSampleChangePercent(symbol),
          hasRealData: false
        });
      }
    }

    setStocksWithPrices(enrichedStocks);
    setLoadingPrices(false);
  };

  // Sample data if api failes
  const getSamplePrice = (symbol) => {
    const base = symbol.charCodeAt(0) + symbol.charCodeAt(1);
    return (50 + (base % 400) + Math.random() * 50).toFixed(2);
  };

  const getSampleChange = (symbol) => {
    const base = symbol.charCodeAt(0);
    return (Math.random() * 10 - 5).toFixed(2);
  };

  const getSampleChangePercent = (symbol) => {
    const base = symbol.charCodeAt(0);
    return (Math.random() * 5 - 2.5).toFixed(2) + '%';
  };

  useEffect(() => {
    if (!isLoading && stocks.length > 0) {
      fetchStockPrices();
    } else if (stocks.length === 0) {
      setStocksWithPrices([]);
    }
  }, [stocks, isLoading]);

  const handleDeleteStock = (stockSymbol, stockName) => {
    Alert.alert(
      'Remove Stock',
      `Are you sure you want to remove ${stockName || stockSymbol} from ${watchlistName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeStockFromWatchlist(watchlistName, stockSymbol),
        },
      ]
    );
  };

  const handleRefresh = () => {
    fetchStockPrices();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
        {/* Top bar with back button and heading */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 16,
          minHeight: 56,
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              padding: 4,
              justifyContent: 'center',
              alignItems: 'center',
              width: 44,
              height: 44,
            }}
          >
            <Image source={BACK_ARROW} style={{ width: 44, height: 44 }} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>
              {watchlistName || 'Watchlist'}
            </Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* Loading indicator */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#11B981" />
          <Text style={{ 
            marginTop: 16, 
            color: theme.secondaryText, 
            fontSize: 16 
          }}>
            Loading watchlist...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      {/* Top bar with back button and heading */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        minHeight: 56,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 4,
            justifyContent: 'center',
            alignItems: 'center',
            width: 44,
            height: 44,
          }}
        >
          <Image source={BACK_ARROW} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>
            {watchlistName || 'Watchlist 1'}
          </Text>
          <Text style={{ fontSize: 14, color: theme.secondaryText, marginTop: 2 }}>
            {stocks.length} {stocks.length === 1 ? 'stock' : 'stocks'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleRefresh}
          style={{
            padding: 4,
            justifyContent: 'center',
            alignItems: 'center',
            width: 44,
            height: 44,
          }}
        >
          <Ionicons 
            name="refresh" 
            size={24} 
            color={loadingPrices ? theme.secondaryText : theme.text} 
          />
        </TouchableOpacity>
      </View>

      {/* Stock cards grid */}
      <FlatList
        data={stocksWithPrices}
        keyExtractor={(item, idx) => (item.symbol || item.ticker) + idx}
        numColumns={2}
        contentContainerStyle={{ alignItems: 'center', paddingTop: 8, paddingBottom: 24 }}
        columnWrapperStyle={{ justifyContent: 'space-between', width: 400, marginBottom: 16 }}
        renderItem={({ item, index }) => (
          <View
            key={(item.ticker || item.symbol) + index}
            style={{
              width: '48%',
              backgroundColor: theme.card,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
              borderWidth: 1,
              borderColor: theme.mode === 'dark' ? theme.border : '#F0F0F0',
              position: 'relative',
            }}
          >
            {/* Delete button - positioned absolutely in top right */}
            <TouchableOpacity
              onPress={() => handleDeleteStock(item.ticker || item.symbol, item.name)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#FF4444',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Touchable area for navigating to details */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Details', { stock: item })}
              style={{ flex: 1 }}
            >
              {/* Logo and name row */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 12,
                marginTop: 8, 
              }}>
                {/* Icon */}
                <View style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 12, 
                  marginRight: 12, 
                  backgroundColor: theme.iconBackground, 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderWidth: theme.mode === 'dark' ? 1 : 0,
                  borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: theme.mode === 'dark' ? 0.3 : 0.1,
                  shadowRadius: 4,
                  elevation: theme.mode === 'dark' ? 4 : 2,
                }}>
                  <Ionicons 
                    name={getStockIcon(item.ticker || item.symbol)} 
                    size={24} 
                    color="#11B981" 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: 'bold', 
                    lineHeight: 20, 
                    letterSpacing: 0.5, 
                    color: theme.text,
                    marginBottom: 2,
                  }}>
                    {item.ticker || item.symbol}
                  </Text>
                  <Text style={{ 
                    fontSize: 12, 
                    lineHeight: 16, 
                    letterSpacing: 0.3, 
                    color: theme.secondaryText,
                    marginTop: 1,
                  }} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              </View>

              {/* Price */}
              <View style={{ marginTop: 8 }}>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: 'bold', 
                  color: theme.text,
                  marginBottom: 4,
                }}>
                  ${item.currentPrice?.toFixed(2) || '0.00'}
                  {!item.hasRealData && (
                    <Text style={{ fontSize: 10, color: theme.secondaryText }}> *</Text>
                  )}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ 
                    fontSize: 12, 
                    color: item.change >= 0 ? '#10B981' : '#EF4444',
                    fontWeight: '600',
                  }}>
                    {item.change >= 0 ? '+' : ''}{item.change?.toFixed(2) || '0.00'}
                  </Text>
                  <Text style={{ 
                    fontSize: 12, 
                    color: theme.secondaryText,
                    marginLeft: 4,
                  }}>
                    ({item.changePercent || '0.00%'})
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="analytics-outline" size={64} color={theme.secondaryText} />
            <Text style={{ 
              color: theme.text, 
              fontSize: 18, 
              fontWeight: '600',
              marginTop: 16,
              marginBottom: 8,
            }}>
              No stocks yet
            </Text>
            <Text style={{ 
              color: theme.secondaryText, 
              fontSize: 14,
              textAlign: 'center',
              maxWidth: 300,
            }}>
              Add stocks to your watchlist to track their performance
            </Text>
          </View>
        }
        refreshing={loadingPrices}
        onRefresh={handleRefresh}
      />

      {/* Loading indicator for price fetching */}
      {loadingPrices && stocksWithPrices.length === 0 && stocks.length > 0 && (
        <View style={{ 
          position: 'absolute', 
          top: '50%', 
          left: 0, 
          right: 0, 
          alignItems: 'center' 
        }}>
          <ActivityIndicator size="large" color="#11B981" />
          <Text style={{ 
            marginTop: 16, 
            color: theme.secondaryText, 
            fontSize: 16 
          }}>
            Loading stock prices...
          </Text>
        </View>
      )}

      {/* Sample data disclaimer */}
      {stocksWithPrices.some(stock => !stock.hasRealData) && (
        <View style={{ 
          backgroundColor: theme.card, 
          padding: 12, 
          margin: 20, 
          marginTop: 0,
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: '#F59E0B'
        }}>
          <Text style={{ 
            color: theme.secondaryText, 
            fontSize: 12,
            textAlign: 'center'
          }}>
            * Some prices shown are sample data due to API limitations
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
} 