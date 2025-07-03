import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import TopGainersScreen from '../screens/TopGainersScreen';
import TopLosersScreen from '../screens/TopLosersScreen';
import DetailsScreen from '../screens/DetailsScreen';
import WatchlistStocksScreen from '../screens/WatchlistStocksScreen';
import ProfileScreen from '../screens/ProfileScreen';

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="TopGainers" component={TopGainersScreen} />
      <HomeStack.Screen name="TopLosers" component={TopLosersScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
      <HomeStack.Screen name="WatchlistStocks" component={WatchlistStocksScreen} />
      <HomeStack.Screen name="Profile" component={ProfileScreen} />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen; 