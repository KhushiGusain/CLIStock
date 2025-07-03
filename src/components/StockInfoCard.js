import React from 'react';
import { View, Text, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getStockIcon } from '../services/stockIconService';

const UP_ARROW = require('../assets/vectors/upArrow.png');
const DOWN_ARROW = require('../assets/vectors/downArrow.png');

function StockInfoCard({ stock, quote, loadingQuote, theme, styles, getSamplePrice, getSampleChange, getSampleChangePercent }) {
  const currentPrice = quote?.['05. price'] || stock?.price || getSamplePrice(stock?.symbol || 'DEMO');
  const change = quote?.['09. change'] || stock?.change || getSampleChange(stock?.symbol || 'DEMO');
  const changePercent = quote?.['10. change percent'] || stock?.change_percentage || getSampleChangePercent(stock?.symbol || 'DEMO');

  const cleanChangePercent = typeof changePercent === 'string' 
    ? changePercent.replace(/[()]/g, '') 
    : changePercent;

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
          <Text style={[styles.currentPrice, { color: theme.text }]}>${parseFloat(currentPrice).toFixed(2)}</Text>
        )}
        <View style={styles.changeContainer}>
          <View style={{ backgroundColor: isPositive ? '#E6F9F2' : '#FDEEEF', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.changeText, { color: isPositive ? '#11B981' : '#F75555', marginRight: 4 }]}>{formattedPercent}</Text>
            <Image source={isPositive ? UP_ARROW : DOWN_ARROW} style={{ width: 15, height: 15, tintColor: isPositive ? '#11B981' : '#F75555', marginRight: 4 }} />
            <Text style={[styles.changeAmount, { color: isPositive ? '#11B981' : '#F75555' }]}>${formattedChange}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default StockInfoCard; 