import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getStockIcon } from '../services/stockIconService';

const UP_ARROW = require('../assets/vectors/upArrow.png');
const DOWN_ARROW = require('../assets/vectors/downArrow.png');

const StockCard = ({ item, idx, isLoser = false, theme, onPress }) => (
  <TouchableOpacity
    key={item.ticker + idx}
    onPress={onPress}
    style={{ 
      width: '48%', 
      backgroundColor: theme.card, 
      borderRadius: 12, 
      padding: 16, 
      marginBottom: idx < 2 ? 12 : 0, 
      shadowColor: '#000', 
      shadowOpacity: 0.03, 
      shadowRadius: 4, 
      elevation: 1, 
      borderWidth: theme.mode === 'dark' ? 1 : 0, 
      borderColor: theme.mode === 'dark' ? theme.border : 'transparent',
      minHeight: 140, 
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', width: 142, height: 40, marginBottom: 12 }}>
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
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.price, lineHeight: 20, letterSpacing: 0.5 }}>{item.price ? `$${item.price}` : 'N/A'}</Text>
    </View>
    <View style={{ backgroundColor: isLoser ? theme.losersPercentageBg : theme.gainersPercentageBg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: 12, color: isLoser ? '#F75555' : '#11B981', fontWeight: '600', marginRight: 2 }}>{item.change_percentage}</Text>
      <Image source={isLoser ? DOWN_ARROW : UP_ARROW} style={{ width: 20, height: 20, tintColor: isLoser ? '#F75555' : '#11B981' }} />
    </View>
  </TouchableOpacity>
);

export default StockCard; 