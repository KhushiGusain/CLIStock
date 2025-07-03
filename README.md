# 📈 Stock Price App

A comprehensive React Native mobile application for tracking stock prices, market trends, and financial news with sentiment analysis. Built with React Native CLI with Cool Usable UI 

Prices are in $ as the API only provided that. Can be changed to RS by using standar coversion rate of 85-86

## ✨ Features

### 📊 **Stock Tracking**
- **Real-time Stock Quotes**: Live price updates with change percentages
- **Top Gainers & Losers**: Daily market movers with detailed statistics
- **Interactive Charts**: Multiple timeframes (1min, 5min, 15min, 30min, 60min, daily, weekly, monthly)
- **Company Overviews**: Detailed company information and financial metrics

### 📱 **Watchlist Management**
- **Personal Watchlist**: Add/remove stocks to track
- **Persistent Storage**: Watchlist data saved locally using AsyncStorage
- **Quick Access**: Easy navigation to watchlist stocks

### 📰 **News & Sentiment Analysis**
- **Financial News**: Latest market news and updates
- **Sentiment Tracking**: Market sentiment analysis
- **Topic-based News**: Filter news by specific topics or tickers

### 🌙 **Dark Mode Support**
- **Theme Toggle**: Switch between light and dark themes
- **Consistent UI**: All screens support both themes
- **Persistent Settings**: Theme preference saved locally

### ⚡ **Performance Optimizations**
- **API Caching**: Intelligent caching system to reduce API calls
- **Backend Proxy**: Custom backend to prevent API exhaustion
- **Efficient Data Management**: Optimized data fetching and storage

### 👤 **User Profile Management (Extra/Static)**
- **Editable Profile**: Update name and email with real-time validation
- **Profile Photo Support**: Avatar display with camera integration placeholder
- **Local Data Persistence**: Profile data stored using AsyncStorage
- **Settings Section**: Notifications, privacy, and help options
- **App Information**: Version and build details display


<h3>App Screenshots</h3>

<table>
  <tr>
    <th>Landing / Home Page</th>
    <th>All Watchlists</th>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/aafc8283-d1fd-42c2-8833-8db5db780c61" style="width:250px; max-width:100%; height:auto;"/></td>
    <td><img src="https://github.com/user-attachments/assets/834a0457-c971-442d-b597-d7276caa3a23" style="width:250px; max-width:100%; height:auto;"/></td>
  </tr>

  <tr>
    <th>Inside My Dream Watchlist</th>
    <th>How’s the Market Doing Today</th>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/3899570d-2606-489f-b1de-ac517ef95570" style="width:250px; max-width:100%; height:auto;"/></td>
    <td><img src="https://github.com/user-attachments/assets/8c6f666a-6499-4d4d-9883-a07ef86dc2fb" style="width:250px; max-width:100%; height:auto;"/></td>
  </tr>

  <tr>
    <th colspan="2">Let's Check How AAPL is Doing</th>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/89b14de4-198c-42ca-8062-c1e751180030" style="width:250px; max-width:100%; height:auto;"/></td>
    <td><img src="https://github.com/user-attachments/assets/d9215bba-7aa0-4eab-9fe9-deb18c285e4c" style="width:250px; max-width:100%; height:auto;"/></td>
  </tr>
</table>

<br/>

<h3>Feature Highlights</h3>

<table>
  <tr>
    <th>Top Gainers Today</th>
    <th>Top Losers Today</th>
    <th>Search Stock</th>
    <th>Create Watchlists</th>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/fd6fe533-ba78-4155-b247-3812a85a8010" style="width:200px; max-width:100%; height:auto;"/></td>
    <td><img src="https://github.com/user-attachments/assets/61ac6cbe-b240-4c6f-8cae-fe8e93a58853" style="width:200px; max-width:100%; height:auto;"/></td>
    <td><img src="https://github.com/user-attachments/assets/1e524e13-ebcb-484e-a15b-9cdb6e97a425" style="width:200px; max-width:100%; height:auto;"/></td>
    <td><img src="https://github.com/user-attachments/assets/a2354614-f4f9-41c7-be52-cb3511edcb8a" style="width:200px; max-width:100%; height:auto;"/></td>
  </tr>
</table>

<br/>

<h3>Extra Screens</h3>

<table>
  <tr>
    <th>Dark Mode</th>
    <th>Profile Page</th>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/9d65aee8-f611-41b4-82a4-e0b89f0ff3d2" style="width:250px; max-width:100%; height:auto;"/></td>
    <td><img src="https://github.com/user-attachments/assets/905b7fed-394e-47f5-80d3-9acdadc2bb19" style="width:250px; max-width:100%; height:auto;"/></td>
  </tr>
</table>


## 🛠️ Tech Stack

### Frontend
- **React Native CLI** (v0.80.1)
- **React Navigation** (v7.x) - Bottom tabs and stack navigation
- **React Native Chart Kit** (v6.12.0) - Interactive charts
- **Victory Native** (v41.17.4) - Advanced charting
- **AsyncStorage** (v2.2.0) - Local data persistence
- **React Native Vector Icons** (v10.2.0) - Icon library

### APIs
- **Alpha Vantage API** - Stock data and market information
- **Custom Backend** - Caching and API management

## 🚀 Installation & Setup

### Prerequisites
- Node.js (>=18)
- React Native CLI
- Android Studio (for Android development)


## 📱 App Structure

```
CLIStock/
├── src/                          # Main source directory
│   ├── screens/                  # App screens
│   │   ├── HomeScreen.js        # Main dashboard with gainers/losers
│   │   ├── WatchlistScreen.js   # Watchlist management
│   │   ├── TopGainersScreen.js  # Top gainers list
│   │   ├── TopLosersScreen.js   # Top losers list
│   │   ├── NewsScreen.js        # News and market sentiment
│   │   ├── ProfileScreen.js     # User profile and settings
│   │   ├── DetailsScreen.js     # Stock details and charts
│   │   └── WatchlistStocksScreen.js # Watchlist stocks view
│   ├── components/              # Reusable UI components
│   │   ├── StockInfoCard.js     # Stock symbol, price, change display
│   │   ├── StockCard.js         # Cards for gainers/losers/search
│   │   ├── StockChart.js        # Complete chart with timeframes
│   │   ├── MetricCard.js        # Market data metrics display
│   │   ├── BackButton.js        # Reusable navigation back button
│   │   ├── Loader.js            # Loading states with spinner
│   │   ├── TimeframeButton.js   # Chart timeframe selection
│   │   ├── ChartPlaceholder.js  # Chart loading/error states
│   │   ├── CompanyInfoRow.js    # Label/value rows for company info
│   │   ├── ModalInputRow.js     # Input + button for modals
│   │   └── WatchlistItem.js     # Watchlist item rows
│   ├── navigation/              # Navigation components
│   │   ├── HomeStackScreen.js   # Home stack navigation
│   │   └── WatchlistStackScreen.js # Watchlist stack navigation
│   ├── contexts/                # React Context providers
│   │   ├── ThemeContext.js      # Dark/Light theme management
│   │   └── WatchlistContext.js  # Watchlist state management
│   ├── services/                # API services and utilities
│   │   ├── alphaVantage.js      # Alpha Vantage API calls
│   │   ├── cacheService.js      # Data caching utilities
│   │   ├── profileService.js    # Profile data management
│   │   └── stockIconService.js  # Stock icon management
├── backend/               # Custom backend server
│   ├── server.js          # Express server
│   └── package.json
├── assets/                # Images and fonts
│   ├── fonts/            # Custom fonts
│   └── vectors/          # App icons
├── ThemeContext.js        # Dark/Light theme management
├── WatchlistContext.js    # Watchlist state management
└── App.jsx               # Main app component
```

## 🔧 Key Features Implementation

### API Caching System
The app uses a sophisticated caching system to minimize API calls:

- **Top Gainers/Losers**: 6-hour cache
- **Company Overviews**: 24-hour cache
- **Stock Quotes**: 1-minute cache
- **Chart Data**: 15-minute cache
- **News Data**: 6-hour cache

### Navigation Structure
- **Bottom Tab Navigation**: Home, Watchlist, News
- **Stack Navigation**: Nested screens for detailed views
- **Custom Tab Icons**: Animated tab indicators

### Data Persistence
- **AsyncStorage**: Watchlist and theme preferences
- **Context API**: Global state management
- **Backend Caching**: Server-side data caching


### Alpha Vantage Integration
- **TOP_GAINERS_LOSERS** - Market movers
- **OVERVIEW** - Company details
- **GLOBAL_QUOTE** - Real-time quotes
- **TIME_SERIES_INTRADAY** - Intraday charts
- **TIME_SERIES_DAILY** - Daily charts
- **TIME_SERIES_WEEKLY** - Weekly charts
- **TIME_SERIES_MONTHLY** - Monthly charts
- **NEW SENTIMENTS** - News Section

## 🎨 UI/UX Features

### Design System
- **Custom Fonts**: Poppins and Noto Sans families
- **Color Scheme**: Green accent (#11B981) with theme support
- **Responsive Design**: Optimized for various screen sizes
- **Smooth Animations**: Enhanced user experience

### Chart Features
- **Multiple Timeframes**: 1min to monthly intervals
- **Interactive Charts**: Zoom, pan, and touch interactions
- **Price Indicators**: Open, high, low, close data
- **Volume Charts**: Trading volume visualization

## 🔒 Security & Performance
The commit history for this project was unintentionally removed due to an accidental git push --force. The current state of the repository reflects the latest working version, but earlier commits are no longer available. All core features and code remain intact.

.env file not included and API key is harcoded for now

### API Management
- **Rate Limiting**: Backend prevents API exhaustion
- **Error Handling**: Graceful fallbacks for API failures
- **Data Validation**: Input sanitization and validation

### Performance Optimizations
- **Lazy Loading**: Screens load on demand
- **Image Optimization**: Efficient asset management
- **Memory Management**: Proper cleanup and optimization
