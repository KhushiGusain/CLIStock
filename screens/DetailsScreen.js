import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';
import WatchlistUnfillIcon from '../assets/vectors/watchlist-unfill.png';
import WatchlistFillIcon from '../assets/vectors/watchlist-fill.png';
import { useWatchlists } from '../WatchlistContext';
import { useTheme } from '../ThemeContext';
import { getStockIcon } from '../services/stockIconService';
import { 
  getCompanyOverview, 
  getQuote, 
  getIntradayData, 
  getDailyData, 
  getWeeklyData, 
  getMonthlyData 
} from '../services/alphaVantage';

const BACK_ARROW = require('../assets/vectors/backArrow.png');
const UP_ARROW = require('../assets/vectors/upArrow.png');
const DOWN_ARROW = require('../assets/vectors/downArrow.png');
const screenWidth = Dimensions.get('window').width;

// Helper functions for sample data (fallback when API fails)
const getSamplePrice = (symbol) => {
  const base = symbol.charCodeAt(0) + symbol.charCodeAt(1);
  return (50 + (base % 400) + Math.random() * 50).toFixed(2);
};

const getSampleChange = (symbol) => {
  const base = symbol.charCodeAt(0);
  const change = (base % 10) - 5 + Math.random() * 2;
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
};

const getSampleChangePercent = (symbol) => {
  const base = symbol.charCodeAt(0);
  const percent = ((base % 10) - 5) * 0.5 + Math.random() * 1;
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
};

function StockInfoCard({ stock, quote, loadingQuote, theme }) {
  // Extract current price and change from quote data or fallback to stock data
  const currentPrice = quote?.['05. price'] || stock?.price || getSamplePrice(stock?.symbol || 'DEMO');
  const change = quote?.['09. change'] || stock?.change || getSampleChange(stock?.symbol || 'DEMO');
  const changePercent = quote?.['10. change percent'] || stock?.change_percentage || getSampleChangePercent(stock?.symbol || 'DEMO');
  
  // Clean up the change percent to remove parentheses and ensure proper formatting
  const cleanChangePercent = typeof changePercent === 'string' 
    ? changePercent.replace(/[()]/g, '') 
    : changePercent;
  
  // Determine if the change is positive
  const isPositive = parseFloat(change) >= 0;
  const formattedChange = isPositive ? `+${Math.abs(parseFloat(change)).toFixed(2)}` : parseFloat(change).toFixed(2);
  const formattedPercent = isPositive ? `+${cleanChangePercent}` : cleanChangePercent;

  return (
    <View style={[styles.stockInfoCard, { backgroundColor: theme.card }]}>
      <View style={styles.stockHeader}>
        <View style={styles.stockIcon}>
          <Ionicons name={getStockIcon(stock?.symbol || stock?.ticker)} size={24} color="#11B981" />
        </View>
        <View style={styles.stockTitleSection}>
          <Text style={[styles.stockSymbol, { color: theme.text }]}>{stock?.symbol || stock?.ticker}</Text>
          <Text style={[styles.stockName, { color: theme.secondaryText }]}>{stock?.name}</Text>
        </View>
      </View>
      
      <View style={styles.priceSection}>
        {loadingQuote ? (
          <Text style={[styles.currentPrice, { color: theme.text }]}>Loading...</Text>
        ) : (
          <Text style={[styles.currentPrice, { color: theme.text }]}>
            ${parseFloat(currentPrice).toFixed(2)}
          </Text>
        )}
        <View style={styles.changeContainer}>
          <View style={{ backgroundColor: isPositive ? '#E6F9F2' : '#FDEEEF', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.changeText, { color: isPositive ? '#11B981' : '#F75555', marginRight: 4 }]}>
              {formattedPercent}
            </Text>
            <Image source={isPositive ? UP_ARROW : DOWN_ARROW} style={{ width: 15, height: 15, tintColor: isPositive ? '#11B981' : '#F75555', marginRight: 4 }} />
            <Text style={[styles.changeAmount, { color: isPositive ? '#11B981' : '#F75555' }]}>
              ${formattedChange}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function DetailsScreen({ navigation, route }) {
  const { stock } = route.params || {};
  const { theme } = useTheme();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const { watchlists, setWatchlists } = useWatchlists();
  const [newWatchlist, setNewWatchlist] = useState('');

  // Company overview state
  const [overview, setOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState(null);

  // Quote state for real-time price data
  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [quoteError, setQuoteError] = useState(null);

  // Chart state
  const [chartData, setChartData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);

  // Extract symbol from various possible fields
  const symbol = stock?.symbol || stock?.ticker || stock?.['1. symbol'];

  const timeframes = ['1D', '1W', '1M', '1Y', '5Y'];

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      if (!symbol) return;
      
      setLoadingOverview(true);
      setLoadingQuote(true);
      setOverviewError(null);
      setQuoteError(null);

      try {
        // Fetch both company overview and current quote in parallel
        const [overviewData, quoteData] = await Promise.all([
          getCompanyOverview(symbol),
          getQuote(symbol)
        ]);
        
        if (isMounted) {
          setOverview(overviewData);
          setQuote(quoteData);
        }
      } catch (err) {
        if (isMounted) {
          setOverviewError('Failed to load company info.');
          setQuoteError('Failed to load current price.');
        }
      } finally {
        if (isMounted) {
          setLoadingOverview(false);
          setLoadingQuote(false);
        }
      }
    }
    
    fetchData();
    return () => { isMounted = false; };
  }, [symbol]);

  useEffect(() => {
    if (symbol) {
      fetchChartData(selectedTimeframe);
    }
  }, [symbol, selectedTimeframe]);

  const fetchChartData = async (timeframe) => {
    if (!symbol) return;
    
    setLoadingChart(true);
    setSelectedDataPoint(null);
    
    try {
      let response;
      let timeSeries;
      let seriesKey;
      let maxPoints;

      switch (timeframe) {
        case '1D':
          response = await getIntradayData(symbol, '60min');
          seriesKey = 'Time Series (60min)';
          maxPoints = 24;
          break;
        case '1W':
          response = await getDailyData(symbol);
          seriesKey = 'Time Series (Daily)';
          maxPoints = 7;
          break;
        case '1M':
          response = await getDailyData(symbol);
          seriesKey = 'Time Series (Daily)';
          maxPoints = 30;
          break;
        case '1Y':
          response = await getWeeklyData(symbol);
          seriesKey = 'Weekly Time Series';
          maxPoints = 52;
          break;
        case '5Y':
          response = await getMonthlyData(symbol);
          seriesKey = 'Monthly Time Series';
          maxPoints = 60;
          break;
        default:
          response = await getDailyData(symbol);
          seriesKey = 'Time Series (Daily)';
          maxPoints = 30;
      }

      timeSeries = response[seriesKey] || {};
      const chartPoints = Object.entries(timeSeries)
        .slice(0, maxPoints)
        .map(([date, data]) => ({
          date,
          price: parseFloat(data['4. close'])
        }))
        .reverse();
      
      setChartData(chartPoints);
    } catch (error) {
      console.log(`Chart data not available for ${timeframe}:`, error);
      // Generate sample chart data for demo
      const sampleData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: parseFloat(getSamplePrice(symbol)) + Math.sin(i * 0.2) * 10
      })).reverse();
      setChartData(sampleData);
    } finally {
      setLoadingChart(false);
    }
  };

  const handleDataPointClick = (data) => {
    const { index, value } = data;
    if (chartData[index]) {
      setSelectedDataPoint({
        index,
        value,
        date: chartData[index].date
      });
    }
  };

  const getSectorIcon = (sector) => {
    const sectorIconMap = {
      'Technology': 'desktop-outline',
      'Information Technology': 'desktop-outline',
      'Financial Services': 'business-outline',
      'Healthcare': 'medical-outline',
      'Energy': 'flash-outline',
      'Consumer Discretionary': 'storefront-outline',
      'Consumer Staples': 'bag-outline',
      'Industrials': 'construct-outline',
      'Communication Services': 'call-outline',
      'Utilities': 'flash-outline',
      'Real Estate': 'home-outline',
      'Materials': 'hammer-outline',
    };
    return sectorIconMap[sector] || 'business-outline';
  };

  // Modal and watchlist functions
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // Create enriched stock object with current price data
  const createEnrichedStock = () => {
    let enrichedStock = { ...stock };
    
    if (quote && !quote.error) {
      // Add current price data from quote
      enrichedStock = {
        ...stock,
        currentPrice: parseFloat(quote['05. price'] || 0),
        change: parseFloat(quote['09. change'] || 0),
        changePercent: quote['10. change percent']?.replace('%', '') || '0',
        hasRealData: true,
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Add sample data as fallback
      const symbol = stock.symbol || stock.ticker;
      enrichedStock = {
        ...stock,
        currentPrice: parseFloat(getSamplePrice(symbol)),
        change: parseFloat(getSampleChange(symbol)),
        changePercent: getSampleChangePercent(symbol),
        hasRealData: false,
        lastUpdated: new Date().toISOString()
      };
    }
    
    return enrichedStock;
  };

  const handleAddWatchlist = () => {
    if (newWatchlist.trim()) {
      const newName = newWatchlist.trim();
      const enrichedStock = createEnrichedStock();
      
      setWatchlists(prev => {
        const cleaned = prev.map(w => ({ ...w, stocks: (w.stocks || []).filter(s => (s.symbol || s.ticker) !== (stock.symbol || stock.ticker)), selected: false }));
        const newWatchlistObj = { name: newName, selected: true, stocks: stock ? [enrichedStock] : [] };
        return cleaned.concat(newWatchlistObj);
      });
      setNewWatchlist('');
      closeModal();
    }
  };

  const handleSelect = idx => {
    const enrichedStock = createEnrichedStock();
    
    setWatchlists(prev => prev.map((w, i) => {
      if (i === idx) {
        const alreadyAdded = w.stocks?.some(s => (s.symbol || s.ticker) === (stock.symbol || stock.ticker));
        return {
          ...w,
          selected: true,
          stocks: alreadyAdded ? w.stocks : [...(w.stocks || []), enrichedStock],
        };
      } else {
        return { ...w, selected: false, stocks: (w.stocks || []).filter(s => (s.symbol || s.ticker) !== (stock.symbol || stock.ticker)) };
      }
    }));
    closeModal();
  };

  const isInAnyWatchlist = watchlists.some(w => w.stocks?.some(s => (s.symbol || s.ticker) === (stock?.symbol || stock?.ticker)));

  const handleWatchlistIconPress = () => {
    if (isInAnyWatchlist) {
      setWatchlists(prev => prev.map(w => ({ ...w, stocks: (w.stocks || []).filter(s => (s.symbol || s.ticker) !== (stock.symbol || stock.ticker)) })));
    } else {
      openModal();
    }
  };

  if (loadingOverview) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={BACK_ARROW} style={{ width: 44, height: 44 }} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Stock Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#11B981" />
          <Text style={[styles.loadingText, { color: theme.secondaryText }]}>Loading stock details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={BACK_ARROW} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{symbol} Details</Text>
        <TouchableOpacity style={styles.watchlistIconButton} onPress={handleWatchlistIconPress}>
          <Image
            source={isInAnyWatchlist ? WatchlistFillIcon : WatchlistUnfillIcon}
            style={{
              width: 28,
              height: 28,
              tintColor: theme.text,
            }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stock Info Card */}
        <StockInfoCard stock={stock} quote={quote} loadingQuote={loadingQuote} theme={theme} />

        {/* Chart Section */}
        <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Price Chart</Text>
          
          {loadingChart ? (
            <View style={styles.chartPlaceholder}>
              <ActivityIndicator size="large" color="#11B981" />
              <Text style={[styles.noChartText, { color: theme.secondaryText }]}>Loading chart...</Text>
            </View>
          ) : chartData.length > 0 ? (
            <View style={styles.chartWrapper}>
              <LineChart
                data={{
                  labels: chartData.map((_, index) => {
                    if (index % Math.ceil(chartData.length / 6) === 0) {
                      return new Date(chartData[index].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }
                    return '';
                  }),
                  datasets: [
                    {
                      data: chartData.map(point => point.price),
                      color: (opacity = 1) => `rgba(17, 185, 129, 0.9)`,
                      strokeWidth: 2,
                      withDots: false,
                    },
                  ],
                }}
                width={screenWidth - 72}
                height={180}
                yAxisLabel="$"
                yAxisSuffix=""
                yAxisInterval={1}
                onDataPointClick={handleDataPointClick}
                chartConfig={{
                  backgroundColor: theme.card,
                  backgroundGradientFrom: theme.card,
                  backgroundGradientTo: theme.card,
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(17, 185, 129, 0.9)`,
                  labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
                  fillShadowGradient: '#11B981',
                  fillShadowGradientOpacity: 0.1,
                  style: {
                    borderRadius: 10,
                  },
                  propsForDots: {
                    r: '0',
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: '#E5E7EB',
                    strokeWidth: 1,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 10,
                }}
              />
              
              {/* Selected Data Point Display */}
              {selectedDataPoint && (
                <View style={[styles.selectedPointContainer, { backgroundColor: theme.card }]}>
                  <Text style={styles.selectedPointPrice}>
                    ${selectedDataPoint.value.toFixed(2)}
                  </Text>
                  <Text style={[styles.selectedPointDate, { color: theme.secondaryText }]}>
                    {new Date(selectedDataPoint.date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric',
                    })}
                  </Text>
                  <TouchableOpacity 
                    style={styles.clearSelectionButton}
                    onPress={() => setSelectedDataPoint(null)}
                  >
                    <Text style={[styles.clearSelectionText, { color: theme.secondaryText }]}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <View style={styles.chartInfo}>
                {(() => {
                  const startPrice = chartData[0]?.price || 0;
                  const endPrice = chartData[chartData.length - 1]?.price || 0;
                  const priceChange = endPrice - startPrice;
                  const percentageChange = startPrice > 0 ? ((priceChange / startPrice) * 100) : 0;
                  const isPositive = priceChange >= 0;
                  
                  return (
                    <>
                      <Text style={[styles.chartInfoText, { color: theme.secondaryText }]}>
                        {selectedTimeframe} performance • {chartData.length} data points
                      </Text>
                      <View style={styles.performanceContainer}>
                        <Text style={[styles.performanceText, { color: isPositive ? '#11B981' : '#F75555' }]}>
                          {isPositive ? '+' : ''}${Math.abs(priceChange).toFixed(2)} ({isPositive ? '+' : ''}{percentageChange.toFixed(2)}%)
                        </Text>
                        <Text style={[styles.performanceLabel, { color: theme.secondaryText }]}>
                          {isPositive ? 'Gained' : 'Lost'} in {selectedTimeframe}
                        </Text>
                      </View>
                      <Text style={[styles.chartLatestPrice, { color: theme.text }]}>
                        Latest: ${endPrice.toFixed(2)} on{' '}
                        {new Date(chartData[chartData.length - 1]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </>
                  );
                })()}
              </View>
            </View>
          ) : (
            <View style={styles.chartPlaceholder}>
              <Ionicons name="show-chart" size={48} color={theme.secondaryText} />
              <Text style={[styles.noChartText, { color: theme.secondaryText }]}>Chart data unavailable</Text>
              <Text style={[styles.noChartSubtext, { color: theme.secondaryText }]}>Please try again later</Text>
            </View>
          )}
          
          {/* Timeframe Selector */}
          <View style={styles.timeframeContainer}>
            {timeframes.map((timeframe) => (
              <TouchableOpacity
                key={timeframe}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === timeframe && styles.timeframeButtonActive
                ]}
                onPress={() => setSelectedTimeframe(timeframe)}
              >
                <Text style={[
                  styles.timeframeText,
                  { color: theme.secondaryText },
                  selectedTimeframe === timeframe && styles.timeframeTextActive
                ]}>
                  {timeframe}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Company Information */}
        <View style={[styles.companyInfoContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Company Information</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Sector</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{overview?.Sector || 'Technology'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Industry</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{overview?.Industry || 'Software'}</Text>
          </View>
        </View>

        {/* Description */}
        {(overview?.Description || stock?.name) && (
          <View style={[styles.descriptionContainer, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
            <Text style={[styles.descriptionText, { color: theme.secondaryText }]}>
              {overview?.Description || `${stock?.name} is a leading company in its sector, providing innovative solutions and services to customers worldwide.`}
            </Text>
          </View>
        )}

        {/* Market Data Cards */}
        <View style={styles.marketDataSection}>
          <View style={styles.marketDataGrid}>
            <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>Market Cap</Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>
                {overview?.MarketCapitalization ? `$${(Number(overview.MarketCapitalization) / 1e9).toFixed(2)}B` : 'N/A'}
              </Text>
            </View>
            
            <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>Volume</Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>
                {quote?.['06. volume'] ? `${(Number(quote['06. volume']) / 1e6).toFixed(2)}M` : 'N/A'}
              </Text>
            </View>
            
            <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>P/E Ratio</Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>{overview?.PERatio || 'N/A'}</Text>
            </View>
            
            <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>52W High</Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>${overview?.['52WeekHigh'] || 'N/A'}</Text>
            </View>
            
            <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>52W Low</Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>${overview?.['52WeekLow'] || 'N/A'}</Text>
            </View>
            
            <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>Beta</Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>{overview?.Beta || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Add to Watchlist Button */}
        <TouchableOpacity style={styles.watchlistButton} onPress={openModal}>
          <Ionicons 
            name={isInAnyWatchlist ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color="white" 
            style={{ marginRight: 8 }}
          />
          <Text style={styles.watchlistButtonText}>
            {isInAnyWatchlist ? 'Manage Watchlists' : 'Add to Watchlist'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Watchlist Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeModal} />
        <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Add to Watchlist</Text>
          <View style={styles.modalInputRow}>
            <TextInput
              placeholder="Add Watchlist Name"
              value={newWatchlist}
              onChangeText={setNewWatchlist}
              style={[styles.modalInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              placeholderTextColor={theme.secondaryText}
            />
            <TouchableOpacity onPress={handleAddWatchlist} style={styles.modalAddButton}>
              <Text style={styles.modalAddButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={watchlists}
            keyExtractor={item => item.name}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleSelect(index)}
                style={[styles.watchlistItem, { backgroundColor: theme.background }]}
              >
                <Text style={[styles.watchlistItemText, { color: theme.secondaryText }]}>{item.name}</Text>
                {item.stocks?.some(s => (s.symbol || s.ticker) === (stock?.symbol || stock?.ticker)) ? (
                  <Ionicons name="checkmark" size={22} color="#11B981" />
                ) : null}
              </TouchableOpacity>
            )}
            style={{ maxHeight: 220 }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6F4F8',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  watchlistIconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  stockInfoCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
  },
  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(230, 247, 242, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stockTitleSection: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockName: {
    fontSize: 14,
    marginTop: 2,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  changeContainer: {
    alignItems: 'flex-end',
  },
  changeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  changeAmount: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
  },
  chartWrapper: {
    alignItems: 'center',
  },
  chartPlaceholder: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChartText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  noChartSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  selectedPointContainer: {
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#11B981',
    alignItems: 'center',
    position: 'relative',
  },
  selectedPointPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11B981',
    marginBottom: 4,
  },
  selectedPointDate: {
    fontSize: 14,
  },
  clearSelectionButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSelectionText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chartInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  chartInfoText: {
    fontSize: 12,
    textAlign: 'center',
  },
  performanceContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  performanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  chartLatestPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  timeframeButtonActive: {
    backgroundColor: '#11B981',
  },
  timeframeText: {
    fontSize: 14,
  },
  timeframeTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  companyInfoContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
  },
  descriptionContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  marketDataSection: {
    marginBottom: 16,
  },
  marketDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6F4F8',
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  watchlistButton: {
    backgroundColor: '#11B981',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  watchlistButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 18,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalInput: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 16,
    borderWidth: 1,
    marginRight: 10,
  },
  modalAddButton: {
    backgroundColor: '#11B981',
    borderRadius: 8,
    paddingHorizontal: 22,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  watchlistItem: {
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
    justifyContent: 'space-between',
  },
  watchlistItemText: {
    fontSize: 16,
  },
});
