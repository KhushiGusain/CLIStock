import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useWatchlists } from '../WatchlistContext';
import { useTheme } from '../ThemeContext';

const BACK_ARROW = require('../assets/vectors/backArrow.png');

export default function WatchlistScreen() {
  const navigation = useNavigation();
  const { watchlists, setWatchlists, isLoading } = useWatchlists();
  const { theme } = useTheme();

  const handleSelect = idx => {
    setWatchlists(watchlists.map((w, i) => ({ ...w, selected: i === idx })));
    navigation.navigate('WatchlistStocks', { watchlistName: watchlists[idx].name });
  };

  // Show loading indicator while watchlists are being loaded
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
            <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>Watchlists</Text>
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
            Loading watchlists...
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
          <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>Watchlists</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>
      
      {/* Watchlist cards */}
      <FlatList
        data={watchlists}
        keyExtractor={item => item.name}
        contentContainerStyle={{ alignItems: 'center', paddingTop: 18, paddingBottom: 24 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleSelect(index)}
            style={{
              width: 400,
              backgroundColor: theme.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.mode === 'dark' ? theme.border : '#E6F4F8',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
              justifyContent: 'space-between',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
              padding: 20,
            }}
          >
            {/* Left side - Watchlist icon and info */}
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: '#11B981',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}>
                <Ionicons name="list" size={24} color="#FFFFFF" />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '600', 
                  color: theme.text,
                  marginBottom: 4,
                }}>
                  {item.name}
                </Text>
                <Text style={{ 
                  fontSize: 14, 
                  color: theme.secondaryText,
                }}>
                  {item.stocks.length} {item.stocks.length === 1 ? 'stock' : 'stocks'}
                </Text>
              </View>
            </View>

            {/* Right side - Arrow and stock count badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.stocks.length > 0 && (
                <View style={{
                  backgroundColor: '#11B981',
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginRight: 12,
                }}>
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                    {item.stocks.length}
                  </Text>
                </View>
              )}
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.secondaryText} 
              />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: theme.secondaryText, fontSize: 16 }}>
              No watchlists available
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
