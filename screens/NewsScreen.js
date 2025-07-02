import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Linking,
  ScrollView,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../ThemeContext';
import { getNewsAndSentiment, getNewsByTopic } from '../services/alphaVantage';

const { width } = Dimensions.get('window');
//ICON MAPPING FOR TOPICS
const NEWS_TOPICS = [
  { id: 'all', label: 'All News', icon: 'newspaper', topic: '' },
  { id: 'technology', label: 'Technology', icon: 'laptop', topic: 'technology' },
  { id: 'financial_markets', label: 'Markets', icon: 'trending-up', topic: 'financial_markets' },
  { id: 'economy_macro', label: 'Economy', icon: 'bar-chart', topic: 'economy_macro' },
  { id: 'earnings', label: 'Earnings', icon: 'cash', topic: 'earnings' },
  { id: 'ipo', label: 'IPOs', icon: 'rocket', topic: 'ipo' },
  { id: 'mergers_and_acquisitions', label: 'M&A', icon: 'git-merge', topic: 'mergers_and_acquisitions' },
  { id: 'energy_transportation', label: 'Energy', icon: 'flash', topic: 'energy_transportation' },
];

export default function NewsScreen({ navigation }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [error, setError] = useState(null);

  const fetchNews = async (topic = '', isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);
    
    try {
      let newsData;
      if (topic) {
        newsData = await getNewsByTopic(topic, 50);
      } else {
        newsData = await getNewsAndSentiment({ limit: 50 });
      }
      
      setNews(newsData.items || []);
    } catch (err) {
      setError('Failed to load news. Please try again.');
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleTopicChange = (topicId, topicValue) => {
    setSelectedTopic(topicId);
    fetchNews(topicValue);
  };

  const onRefresh = () => {
    setRefreshing(true);
    const currentTopic = NEWS_TOPICS.find(t => t.id === selectedTopic);
    fetchNews(currentTopic?.topic || '', true);
  };

  const formatTimeAgo = (timeString) => {
    try {
      const year = parseInt(timeString.substring(0, 4));
      const month = parseInt(timeString.substring(4, 6)) - 1;
      const day = parseInt(timeString.substring(6, 8));
      const hour = parseInt(timeString.substring(9, 11));
      const minute = parseInt(timeString.substring(11, 13));
      
      const newsTime = new Date(year, month, day, hour, minute);
      const now = new Date();
      const diffMs = now - newsTime;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffHours < 1) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch (e) {
      return 'Recently';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'bullish': return '#11B981';
      case 'somewhat-bullish': return '#10B981';
      case 'bearish': return '#EF4444';
      case 'somewhat-bearish': return '#F97316';
      default: return theme.secondaryText;
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'bullish': return 'trending-up';
      case 'somewhat-bullish': return 'chevron-up';
      case 'bearish': return 'trending-down';
      case 'somewhat-bearish': return 'chevron-down';
      default: return 'remove';
    }
  };

  const openArticle = (url) => {
    if (url && url !== 'https://example.com/news1' && url !== 'https://example.com/news2') {
      Linking.openURL(url);
    }
  };

  const renderNewsItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => openArticle(item.url)}
      style={{
        backgroundColor: theme.card,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        borderWidth: 1,
        borderColor: theme.border + '20'
      }}
      activeOpacity={0.7}
    >
      {/* HEADER */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: theme.secondaryText,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              {item.source}
            </Text>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.secondaryText + '40', marginHorizontal: 8 }} />
            <Text style={{
              fontSize: 12,
              color: theme.secondaryText,
              fontWeight: '500'
            }}>
              {formatTimeAgo(item.time_published)}
            </Text>
          </View>
        </View>
        
        {/* SENTIMENT BADGE */}
        {item.overall_sentiment_label && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: getSentimentColor(item.overall_sentiment_label) + '15',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12
          }}>
            <Ionicons 
              name={getSentimentIcon(item.overall_sentiment_label)} 
              size={12} 
              color={getSentimentColor(item.overall_sentiment_label)}
              style={{ marginRight: 4 }}
            />
            <Text style={{
              fontSize: 10,
              fontWeight: '700',
              color: getSentimentColor(item.overall_sentiment_label),
              textTransform: 'uppercase'
            }}>
              {item.overall_sentiment_label.replace('-', ' ')}
            </Text>
          </View>
        )}
      </View>

      {/* TITLE */}
      <Text style={{
        fontSize: 16,
        fontWeight: '700',
        color: theme.text,
        lineHeight: 22,
        marginBottom: 8
      }} numberOfLines={3}>
        {item.title}
      </Text>

      {/* SUMMARY */}
      <Text style={{
        fontSize: 14,
        color: theme.secondaryText,
        lineHeight: 20,
        marginBottom: 12
      }} numberOfLines={3}>
        {item.summary}
      </Text>

      {/* TOPICS */}
      {item.topics && item.topics.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
          {item.topics.slice(0, 3).map((topic, idx) => (
            <View key={idx} style={{
              backgroundColor: theme.secondaryText + '10',
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 8,
              marginRight: 6,
              marginBottom: 4
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '600',
                color: theme.secondaryText,
                textTransform: 'capitalize'
              }}>
                {topic.topic.replace('_', ' ')}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* TICKER SENTIMENT */}
      {item.ticker_sentiment && item.ticker_sentiment.length > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Ionicons name="pricetag" size={14} color={theme.secondaryText} style={{ marginRight: 6 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.ticker_sentiment.slice(0, 5).map((ticker, idx) => (
              <View key={idx} style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: getSentimentColor(ticker.ticker_sentiment_label) + '15',
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 6,
                marginRight: 6
              }}>
                <Text style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: getSentimentColor(ticker.ticker_sentiment_label),
                  marginRight: 4
                }}>
                  {ticker.ticker}
                </Text>
                <Ionicons 
                  name={getSentimentIcon(ticker.ticker_sentiment_label)} 
                  size={10} 
                  color={getSentimentColor(ticker.ticker_sentiment_label)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* READ MORE INDICATOR */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12 }}>
        <Text style={{
          fontSize: 12,
          fontWeight: '600',
          color: '#11B981',
          marginRight: 4
        }}>
          Read more
        </Text>
        <Ionicons name="arrow-forward" size={12} color="#11B981" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      {/* HEADER */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border + '20'
      }}>
        <View>
          <Text style={{
            fontSize: 24,
            fontWeight: '700',
            color: theme.text,
            marginBottom: 2
          }}>
            Market News
          </Text>
          <Text style={{
            fontSize: 14,
            color: theme.secondaryText,
            fontWeight: '500'
          }}>
            Latest market sentiment & analysis
          </Text>
        </View>
        <TouchableOpacity
          onPress={onRefresh}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.card,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.border + '40'
          }}
        >
          <Ionicons name="refresh" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* TOPIC FILTER */}
      <View style={{ paddingVertical: 16 }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {NEWS_TOPICS.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              onPress={() => handleTopicChange(topic.id, topic.topic)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: selectedTopic === topic.id ? '#11B981' : theme.card,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                marginRight: 12,
                borderWidth: 1,
                borderColor: selectedTopic === topic.id ? '#11B981' : theme.border + '40'
              }}
            >
              <Ionicons 
                name={topic.icon} 
                size={16} 
                color={selectedTopic === topic.id ? '#FFFFFF' : theme.text}
                style={{ marginRight: 6 }}
              />
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: selectedTopic === topic.id ? '#FFFFFF' : theme.text
              }}>
                {topic.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* NEWS LIST */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#11B981" />
          <Text style={{
            color: theme.secondaryText,
            fontSize: 16,
            marginTop: 16,
            fontWeight: '500'
          }}>
            Loading latest news...
          </Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.secondaryText + '60'} />
          <Text style={{
            color: theme.text,
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
            marginTop: 16,
            marginBottom: 8
          }}>
            Unable to load news
          </Text>
          <Text style={{
            color: theme.secondaryText,
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 24
          }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => fetchNews(NEWS_TOPICS.find(t => t.id === selectedTopic)?.topic || '')}
            style={{
              backgroundColor: '#11B981',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#11B981']}
              tintColor="#11B981"
            />
          }
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
              <Ionicons name="newspaper-outline" size={48} color={theme.secondaryText + '60'} />
              <Text style={{
                color: theme.text,
                fontSize: 18,
                fontWeight: '600',
                marginTop: 16,
                marginBottom: 8
              }}>
                No news articles
              </Text>
              <Text style={{
                color: theme.secondaryText,
                fontSize: 14,
                textAlign: 'center'
              }}>
                Try selecting a different topic or refresh the page
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
} 