import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import { getTopGainersLosers, searchSymbols } from '../services/alphaVantage';
import { getStockIcon } from '../services/stockIconService';
import profileService from '../services/profileService';
import StockCard from '../components/StockCard';

const AVATAR = require('../assets/vectors/avatar.png');
const SEARCH = require('../assets/vectors/search.png');
const SUN = require('../assets/vectors/sun.png');
const MOON = require('../assets/vectors/moon.png');
const UP_ARROW = require('../assets/vectors/upArrow.png');
const DOWN_ARROW = require('../assets/vectors/downArrow.png');

export default function HomeScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [userName, setUserName] = useState('Sophia Calzoni');
  // Search state
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTopGainersLosers();
      setGainers(data.top_gainers?.slice(0, 4) || []);
      setLosers(data.top_losers?.slice(0, 4) || []);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    loadUserProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserProfile = async () => {
    try {
      const profileData = await profileService.getProfileData();
      setUserName(profileData.name);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // SEARCH HANDLER
  const handleSearch = async (text) => {
    setSearchText(text);
    if (text.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    setShowDropdown(true);
    try {
      const results = await searchSymbols(text);
      setSearchResults(results);
    } catch (e) {
      setSearchResults([]);
    }
    setSearchLoading(false);
  };

  const handleSelectResult = (item) => {
    setShowDropdown(false);
    setSearchText('');
    setSearchResults([]);
    navigation.navigate('Details', {
      stock: {
        ticker: item['1. symbol'],
        name: item['2. name'],
        region: item['4. region'],
        currency: item['8. currency'],
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >
        {/* TOP SECTION */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, height: 60 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={AVATAR} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} />
          <View>
            <Text style={{ color: theme.secondaryText, fontSize: 14, fontFamily: 'NotoSans-Regular' }}>Welcome back</Text>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', fontFamily: 'NotoSans_Condensed-Bold' }}>{userName}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile')} 
            style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 6,
              marginRight: 8,
            }}
          >
            <Ionicons name="settings-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={{
            width: 42,
            height: 42,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 6,
          }}>
            <Image source={theme.mode === 'light' ? MOON : SUN} style={{ width: 28, height: 28 }} />
          </TouchableOpacity>
        </View>
      </View>
      {/* ENHANCED SEARCH SECTION */}
      <View style={{ alignItems: 'center', marginBottom: 16, marginTop: 14, paddingHorizontal: 20 }}>
        {/* SEARCH INPUT CONTAINER */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          width: '100%',
          maxWidth: 400,
          height: 52, 
          borderRadius: 16, 
          borderWidth: showDropdown ? 2 : 1.5, 
          borderColor: showDropdown ? '#11B981' : theme.border, 
          backgroundColor: theme.input, 
          paddingLeft: 18,
          paddingRight: 18,
          shadowColor: '#000',
          shadowOpacity: showDropdown ? 0.12 : 0.04,
          shadowRadius: showDropdown ? 12 : 4,
          shadowOffset: { width: 0, height: showDropdown ? 4 : 2 },
          elevation: showDropdown ? 8 : 2,
        }}>
          <Ionicons 
            name="search" 
            size={22} 
            color={showDropdown ? '#11B981' : theme.secondaryText} 
            style={{ marginRight: 12 }}
          />
          <TextInput
            placeholder="Search stocks, companies..."
            placeholderTextColor={theme.secondaryText}
            style={{ 
              flex: 1, 
              height: 50, 
              fontSize: 16, 
              fontWeight: '500',
              borderWidth: 0, 
              paddingTop: 0, 
              paddingBottom: 0, 
              paddingLeft: 0, 
              backgroundColor: 'transparent', 
              color: theme.text 
            }}
            value={searchText}
            onChangeText={handleSearch}
            onFocus={() => { if (searchText.length > 1) setShowDropdown(true); }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            returnKeyType="search"
            autoCapitalize="characters"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setSearchText('');
                setSearchResults([]);
                setShowDropdown(false);
              }}
              style={{ 
                padding: 4, 
                borderRadius: 12, 
                backgroundColor: theme.secondaryText + '20',
                marginLeft: 8
              }}
            >
              <Ionicons name="close" size={16} color={theme.secondaryText} />
            </TouchableOpacity>
          )}
        </View>

        {/* ENHANCED DROPDOWN RESULTS */}
        {showDropdown && (
          <>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'transparent',
                zIndex: 999,
              }}
              activeOpacity={1}
              onPress={() => {
                setShowDropdown(false);
                setSearchResults([]);
              }}
            />
            <View style={{ 
              position: 'absolute', 
              top: 60, 
              left: 20,
              right: 20,
              width: '100%',
              maxWidth: 400,
              backgroundColor: theme.card, 
              borderRadius: 16, 
              borderWidth: 1, 
              borderColor: theme.border + '40',
              zIndex: 1000, 
              maxHeight: 280, 
              shadowColor: '#000', 
              shadowOpacity: 0.15, 
              shadowRadius: 20, 
              shadowOffset: { width: 0, height: 8 },
              elevation: 12,
              overflow: 'hidden'
            }}>
            {/* SEARCH HEADER */}
            <View style={{ 
              paddingHorizontal: 18, 
              paddingVertical: 12, 
              borderBottomWidth: 1, 
              borderBottomColor: theme.border + '30',
              backgroundColor: theme.background + '90'
            }}>
              <Text style={{ 
                color: theme.secondaryText, 
                fontSize: 12, 
                fontWeight: '600', 
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                {searchLoading ? 'Searching...' : `${searchResults.length} Results`}
              </Text>
            </View>

            {/* Results Content */}
            <View style={{ backgroundColor: theme.card }}>
              {searchLoading ? (
                <View style={{ 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  paddingVertical: 32 
                }}>
                  <ActivityIndicator size="small" color="#11B981" />
                  <Text style={{ 
                    color: theme.secondaryText, 
                    fontSize: 14, 
                    marginTop: 12,
                    fontWeight: '500'
                  }}>
                    Searching stocks...
                  </Text>
                </View>
              ) : searchResults.length === 0 ? (
                <View style={{ 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  paddingVertical: 32,
                  paddingHorizontal: 20
                }}>
                  <Ionicons name="search-circle-outline" size={32} color={theme.secondaryText + '60'} />
                  <Text style={{ 
                    color: theme.secondaryText, 
                    fontSize: 16, 
                    textAlign: 'center', 
                    marginTop: 12,
                    fontWeight: '500'
                  }}>
                    No results found
                  </Text>
                  <Text style={{ 
                    color: theme.secondaryText + '80', 
                    fontSize: 14, 
                    textAlign: 'center', 
                    marginTop: 4
                  }}>
                    Try searching for a different stock symbol
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={searchResults}
                  keyExtractor={item => item['1. symbol']}
                  nestedScrollEnabled={true}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity 
                      onPress={() => handleSelectResult(item)} 
                      style={{ 
                        paddingVertical: 16, 
                        paddingHorizontal: 18,
                        borderBottomWidth: index < searchResults.length - 1 ? 1 : 0,
                        borderBottomColor: theme.border + '20',
                        backgroundColor: theme.card,
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                      activeOpacity={0.7}
                    >
                      {/* Stock Icon */}
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: '#11B981' + '15',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12
                      }}>
                        <Ionicons 
                          name={getStockIcon(item['1. symbol'])} 
                          size={20} 
                          color="#11B981" 
                        />
                      </View>
                      
                      {/* STOCK INFO */}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ 
                            color: theme.text, 
                            fontSize: 16, 
                            fontWeight: '700',
                            marginRight: 8
                          }}>
                            {item['1. symbol']}
                          </Text>
                          <View style={{
                            backgroundColor: theme.secondaryText + '10',
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4
                          }}>
                            <Text style={{ 
                              color: theme.secondaryText, 
                              fontSize: 10,
                              fontWeight: '600',
                              textTransform: 'uppercase'
                            }}>
                              {item['4. region'] || 'US'}
                            </Text>
                          </View>
                        </View>
                        <Text style={{ 
                          color: theme.secondaryText, 
                          fontSize: 14,
                          marginTop: 2,
                          lineHeight: 18
                        }} numberOfLines={1}>
                          {item['2. name']}
                        </Text>
                      </View>

                      {/* Arrow Icon */}
                      <Ionicons 
                        name="chevron-forward" 
                        size={18} 
                        color={theme.secondaryText + '60'} 
                      />
                    </TouchableOpacity>
                  )}
                  style={{ maxHeight: 200 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </View>
        </>
        )}
      </View>
      {/* TOP GAINERS SECTION */}
      <View style={{ marginTop: 8 }}>
        {/* HEADER */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 5, marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>Top Gainers</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TopGainers')}>
            <Text style={{ fontSize: 14, color: '#4F7CFE', fontWeight: '500' }}>See All</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={theme.accent} style={{ marginVertical: 24 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginVertical: 24 }}>{error}</Text>
        ) : gainers.length === 0 ? (
          <Text style={{ color: theme.secondaryText, textAlign: 'center', marginVertical: 24 }}>No data available.</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 }}>
            {gainers.map((item, idx) => (
              <StockCard
                key={item.ticker + idx}
                item={item}
                idx={idx}
                isLoser={false}
                theme={theme}
                onPress={() => navigation.navigate('Details', { stock: item })}
              />
            ))}
          </View>
        )}
      </View>
      {/* TOP LOSERS SECTION */}
      <View style={{ marginTop: 24 }}>
        {/* HEADER */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>Top Losers</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TopLosers')}>
            <Text style={{ fontSize: 16, color: '#4F7CFE', fontWeight: '500' }}>See All</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={theme.accent} style={{ marginVertical: 24 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginVertical: 24 }}>{error}</Text>
        ) : losers.length === 0 ? (
          <Text style={{ color: theme.secondaryText, textAlign: 'center', marginVertical: 24 }}>No data available.</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 }}>
            {losers.map((item, idx) => (
              <StockCard
                key={item.ticker + idx}
                item={item}
                idx={idx}
                isLoser={true}
                theme={theme}
                onPress={() => navigation.navigate('Details', { stock: item })}
              />
            ))}
          </View>
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}