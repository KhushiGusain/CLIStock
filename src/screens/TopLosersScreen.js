import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import cacheService from '../services/cacheService';
import { getStockIcon } from '../services/stockIconService';

const BACK_ARROW = require('../assets/vectors/backArrow.png');

export default function TopLosersScreen({ navigation }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [losers, setLosers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // check if we have cached any data before
        const cachedData = await cacheService.getCachedData();
        if (cachedData) {
          // Use cached data immediately, no loading state
          setLosers(cachedData.top_losers || []);
          setLoading(false);
          console.log('✅ [TopLosers] Using cached data');
          return;
        }

        // fetch fresh data then
        setLoading(true);
        setError(null);
        const data = await cacheService.getTopGainersLosers();
        setLosers(data.top_losers || []);
      } catch (err) {
        setError('Failed to load data.');
        console.error('❌ [TopLosers] Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', { stock: item })}
      style={{
        flex: 1,
        backgroundColor: theme.card,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        minHeight: 0,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
        marginRight: index % 2 === 0 ? 12 : 0,
        borderWidth: theme.mode === 'dark' ? 1 : 0,
        borderColor: theme.mode === 'dark' ? theme.border : 'transparent',
      }}
    >
      {/* Logo and name row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', width: 142, height: 40, marginBottom: 6 }}>
        {/* Sector-specific icon */}
        <View style={{ 
          width: 54, 
          height: 46, 
          borderRadius: 12, 
          marginRight: 6, 
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
          <Ionicons name={getStockIcon(item.ticker)} size={24} color="#11B981" />
        </View>
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 20, letterSpacing: 0.5, color: theme.text }}>{item.ticker}</Text>
          <Text style={{ fontSize: 12, lineHeight: 16, letterSpacing: 0.3, color: theme.secondaryText, marginTop: 1 }} numberOfLines={1}>{item.name}</Text>
        </View>
      </View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.price, marginBottom: 4, lineHeight: 20, letterSpacing: 0.5 }}>{item.price ? `$${item.price}` : 'N/A'}</Text>
      <View style={{ backgroundColor: theme.losersPercentageBg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, color: '#EF4444', fontWeight: '600', marginRight: 2 }}>{item.change_percentage}</Text>
        <Image source={require('../assets/vectors/downArrow.png')} style={{ width: 20, height: 20, tintColor: '#EF4444' }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      {/* Top bar with back arrow and heading */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, minHeight: 56 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={BACK_ARROW} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', marginRight: 36, justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>Top Losers</Text>
        </View>
      </View>
      {/* Losers grid */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.accent} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
      ) : losers.length === 0 ? (
        <Text style={{ color: theme.secondaryText, textAlign: 'center', marginTop: 40 }}>No data available.</Text>
      ) : (
        <FlatList
          data={losers}
          renderItem={renderItem}
          keyExtractor={(_, idx) => idx.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
} 