import * as React from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Image, View, LogBox } from 'react-native';
import { WatchlistProvider } from './src/contexts/WatchlistContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Disable development error overlays
LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
  'Warning:',
  'Error:',
  'Require cycle:',
  'Non-serializable values were found in the navigation state',
]);

import HomeScreen from './src/screens/HomeScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import TopGainersScreen from './src/screens/TopGainersScreen';
import TopLosersScreen from './src/screens/TopLosersScreen';
import NewsScreen from './src/screens/NewsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import WatchlistStocksScreen from './src/screens/WatchlistStocksScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import ActiveLine from './src/assets/vectors/ActiveLine.png';
import HomeFillIcon from './src/assets/vectors/home-fill.png';
import HomeUnfillIcon from './src/assets/vectors/home-unfill.png';
import WatchlistFillIcon from './src/assets/vectors/watchlist-fill.png';
import WatchlistUnfillIcon from './src/assets/vectors/watchlist-unfill.png';

import HomeStackScreen from './src/navigation/HomeStackScreen';
import WatchlistStackScreen from './src/navigation/WatchlistStackScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const WatchlistStack = createNativeStackNavigator();

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console but don't show on screen
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', padding: 20 }}>
            Something went wrong. Please restart the app.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <WatchlistProvider>
          <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarShowLabel: false,
              tabBarIcon: ({ focused, color, size }) => {
                let iconSource;
                if (route.name === 'Home') {
                  iconSource = HomeUnfillIcon;
                } else if (route.name === 'Watchlist') {
                  iconSource = WatchlistUnfillIcon;
                } else if (route.name === 'News') {
                  iconSource = NewsIcon;
                }
                return (
                  <Image
                    source={iconSource}
                    style={{
                      width: size,
                      height: size,
                      tintColor: '#FFFFFF',
                      resizeMode: 'contain',
                    }}
                  />
                );
              },
              tabBarActiveTintColor: '#11B981',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: { backgroundColor: '#11B981' },
            })}
          >
            <Tab.Screen 
              name="Home" 
              component={HomeStackScreen} 
              options={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeMain';
                return {
                  headerShown: false,
                  tabBarStyle:
                    routeName === 'TopGainers' || routeName === 'TopLosers' || routeName === 'Details'
                      ? { display: 'none' }
                      : { backgroundColor: '#11B981', height: 72 },
                  tabBarIcon: ({ focused, color, size }) => (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', minWidth: 80 }}>
                      {focused && (
                        <Image
                          source={ActiveLine}
                          style={{
                            position: 'relative',
                            top: 11,
                            width: 73,
                            height: 3,
                            marginBottom: 4,
                            borderBottomRightRadius: 3,
                            borderBottomLeftRadius: 3,
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                      )}
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: focused ? 10 : 13 }}>
                        <Image
                          source={focused ? HomeFillIcon : HomeUnfillIcon}
                          style={{
                            width: size + 2,
                            height: size + 2,
                            tintColor: '#FFFFFF',
                            resizeMode: 'contain',
                            marginRight: 4,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: focused ? 'NotoSans_Condensed-Bold' : 'NotoSans-Regular',
                            fontWeight: focused ? '700' : '400',
                            fontSize: focused ? 14 : 13,
                            lineHeight: 18,
                            color: '#FFFFFF',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            letterSpacing: 0,
                            maxWidth: 60,
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          Home
                        </Text>
                      </View>
                    </View>
                  ),
                  tabBarActiveTintColor: '#11B981',
                  tabBarInactiveTintColor: 'gray',
                };
              }}
            />
            <Tab.Screen 
              name="Watchlist" 
              component={WatchlistStackScreen} 
              options={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? 'WatchlistMain';
                return {
                  headerShown: false,
                  tabBarStyle:
                    routeName === 'WatchlistStocks'
                      ? { display: 'none' }
                      : { backgroundColor: '#11B981', height: 72 },
                  tabBarIcon: ({ focused, color, size }) => (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', minWidth: 80 }}>
                      {focused && (
                        <Image
                          source={ActiveLine}
                          style={{
                            position: 'relative',
                            top: 11,
                            width: 73,
                            height: 3,
                            marginBottom: 4,
                            borderBottomRightRadius: 3,
                            borderBottomLeftRadius: 3,
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                      )}
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: focused ? 10 : 13 }}>
                        <Image
                          source={focused ? WatchlistFillIcon : WatchlistUnfillIcon}
                          style={{
                            width: size + 2,
                            height: size + 2,
                            tintColor: '#FFFFFF',
                            resizeMode: 'contain',
                            marginRight: 4,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: focused ? 'NotoSans_Condensed-Bold' : 'NotoSans-Regular',
                            fontWeight: focused ? '700' : '400',
                            fontSize: focused ? 14 : 13,
                            lineHeight: 18,
                            color: '#FFFFFF',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            letterSpacing: 0,
                            maxWidth: 60,
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          Watchlist
                        </Text>
                      </View>
                    </View>
                  ),
                  tabBarActiveTintColor: '#11B981',
                  tabBarInactiveTintColor: 'gray',
                };
              }}
            />
            <Tab.Screen 
              name="News" 
              component={NewsScreen} 
              options={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#11B981', height: 72 },
                tabBarIcon: ({ focused, color, size }) => (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', minWidth: 80 }}>
                    {focused && (
                      <Image
                        source={ActiveLine}
                        style={{
                          position: 'relative',
                          top: 11,
                          width: 73,
                          height: 3,
                          marginBottom: 4,
                          borderBottomRightRadius: 3,
                          borderBottomLeftRadius: 3,
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: focused ? 10 : 13 }}>
                      <View style={{
                        width: size + 2,
                        height: size + 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 4,
                      }}>
                        <Ionicons
                          name={focused ? "newspaper" : "newspaper-outline"}
                          size={size - 1}
                          color="#FFFFFF"
                        />
                      </View>
                      <Text
                        style={{
                          fontFamily: focused ? 'NotoSans_Condensed-Bold' : 'NotoSans-Regular',
                          fontWeight: focused ? '700' : '400',
                          fontSize: focused ? 14 : 13,
                          lineHeight: 18,
                          color: '#FFFFFF',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          letterSpacing: 0,
                          maxWidth: 60,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        News
                      </Text>
                    </View>
                  </View>
                ),
                tabBarActiveTintColor: '#11B981',
                tabBarInactiveTintColor: 'gray',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </WatchlistProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}
