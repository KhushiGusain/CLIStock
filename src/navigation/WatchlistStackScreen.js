import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WatchlistScreen from '../screens/WatchlistScreen';
import WatchlistStocksScreen from '../screens/WatchlistStocksScreen';
import DetailsScreen from '../screens/DetailsScreen';

const WatchlistStack = createNativeStackNavigator();

function WatchlistStackScreen() {
  return (
    <WatchlistStack.Navigator screenOptions={{ headerShown: false }}>
      <WatchlistStack.Screen name="WatchlistMain" component={WatchlistScreen} />
      <WatchlistStack.Screen name="WatchlistStocks" component={WatchlistStocksScreen} />
      <WatchlistStack.Screen name="Details" component={DetailsScreen} />
    </WatchlistStack.Navigator>
  );
}

export default WatchlistStackScreen; 