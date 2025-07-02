# 📈 Stock Price App

A comprehensive React Native mobile application for tracking stock prices, market trends, and financial news with sentiment analysis. Built with React Native CLI and featuring a custom backend for efficient API management.

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

### 👤 **User Profile Management**
- **Editable Profile**: Update name and email with real-time validation
- **Profile Photo Support**: Avatar display with camera integration placeholder
- **Local Data Persistence**: Profile data stored using AsyncStorage
- **Settings Section**: Notifications, privacy, and help options
- **App Information**: Version and build details display

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

**Landing / Home Page**  
<img src="https://github.com/user-attachments/assets/8591958e-895c-4395-9323-d5ae8ac1668b" style="width:300px; max-width:100%; height:auto;"/>

**All Watchlists**  
<img src="https://github.com/user-attachments/assets/98c6be03-f1f2-4bbb-bd7f-895db6ce8f53" style="width:300px; max-width:100%; height:auto;"/>

**Inside My Dream Watchlist**  
<img src="https://github.com/user-attachments/assets/b041f65c-2d1a-43de-a0f2-16130d4a1585" style="width:300px; max-width:100%; height:auto;"/>

**Let's Check How AAPL is Doing**  
<img src="https://github.com/user-attachments/assets/89b14de4-198c-42ca-8062-c1e751180030" style="width:300px; max-width:100%; height:auto;"/>
<img src="https://github.com/user-attachments/assets/d9215bba-7aa0-4eab-9fe9-deb18c285e4c" style="width:300px; max-width:100%; height:auto;"/>

**How's the Market Doing Today**  
<img src="https://github.com/user-attachments/assets/8c6f666a-6499-4d4d-9883-a07ef86dc2fb" style="width:300px; max-width:100%; height:auto;"/>

**Top Gainers Today..**

**Top Losers Today..**

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
CLIStock-main/
├── screens/                 # App screens
│   ├── HomeScreen.js       # Main dashboard
│   ├── WatchlistScreen.js  # Watchlist management
│   ├── TopGainersScreen.js # Top gainers list
│   ├── TopLosersScreen.js  # Top losers list
│   ├── NewsScreen.js       # News and sentiment
│   ├── DetailsScreen.js    # Stock details and charts
│   ├── ProfileScreen.js    # User profile and settings
│   └── WatchlistStocksScreen.js
├── services/               # API services
│   ├── alphaVantage.js    # Stock data API calls
│   ├── cacheService.js    # Caching utilities
│   ├── profileService.js  # Profile data management
│   └── stockIconService.js # Stock icon management
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

### Profile Management System
The app includes a comprehensive profile management system:

- **Profile Data Service**: Dedicated service for profile operations
- **Local Storage**: Profile data persisted using AsyncStorage
- **Real-time Editing**: Inline editing for name and email fields
- **Data Validation**: Email format validation and empty field checks
- **Error Handling**: Graceful error handling with user feedback
- **Settings Integration**: Profile accessible through settings menu

### Navigation Structure
- **Bottom Tab Navigation**: Home, Watchlist, News
- **Stack Navigation**: Nested screens for detailed views
- **Custom Tab Icons**: Animated tab indicators

### Data Persistence
- **AsyncStorage**: Watchlist, theme preferences, and profile data
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

### Profile Page Design
- **Clean Interface**: Modern card-based layout with proper spacing
- **Interactive Elements**: Edit buttons, save/cancel actions
- **Loading States**: Activity indicators during data operations
- **Theme Integration**: Full dark/light mode support
- **Accessibility**: Proper touch targets and visual feedback

### Chart Features
- **Multiple Timeframes**: 1min to monthly intervals
- **Interactive Charts**: Zoom, pan, and touch interactions
- **Price Indicators**: Open, high, low, close data
- **Volume Charts**: Trading volume visualization

## 🔒 Security & Performance

### API Management
- **Rate Limiting**: Backend prevents API exhaustion
- **Error Handling**: Graceful fallbacks for API failures
- **Data Validation**: Input sanitization and validation

### Profile Data Security
- **Local Storage**: Profile data stored securely on device
- **Input Validation**: Email format and field validation
- **Error Recovery**: Graceful handling of storage errors
- **Data Integrity**: Consistent data structure maintenance

### Performance Optimizations
- **Lazy Loading**: Screens load on demand
- **Image Optimization**: Efficient asset management
- **Memory Management**: Proper cleanup and optimization
- **Profile Caching**: Efficient profile data retrieval

