// MAPS THE STOCKS TO THE APPROPRIATE ICONS
export const getStockIcon = (ticker) => {
  const iconMap = {

// USED AI TO GENERATE THE ICONS MATCHING THE SECTOR OF THE STOCK

    // Technology - Devices & Hardware
    'AAPL': 'phone-portrait',
    'SAMSUNG': 'phone-portrait',
    'SONY': 'headset',
    'XIAOMI': 'phone-portrait',
    'OPPO': 'phone-portrait',
    'VIVO': 'phone-portrait',
    'ONEPLUS': 'phone-portrait',
    'HUAWEI': 'phone-portrait',
    
    // Technology - Software & Cloud
    'MSFT': 'desktop',
    'GOOGL': 'search',
    'GOOGLE': 'search',
    'IBM': 'server',
    'ORCL': 'server',
    'CRM': 'cloud',
    'ADBE': 'brush',
    'ZOOM': 'videocam',
    'SLACK': 'chatbubbles',
    'ATLASSIAN': 'git-branch',
    'SALESFORCE': 'cloud',
    
    // Technology - Semiconductors
    'NVDA': 'hardware-chip',
    'AMD': 'hardware-chip',
    'INTC': 'hardware-chip',
    'TSM': 'hardware-chip',
    'QCOM': 'hardware-chip',
    'AVGO': 'hardware-chip',
    'MU': 'hardware-chip',
    'MRVL': 'hardware-chip',
    
    // E-commerce & Retail
    'AMZN': 'storefront',
    'SHOP': 'storefront',
    'BABA': 'storefront',
    'JD': 'storefront',
    'EBAY': 'storefront',
    'ETSY': 'storefront',
    'WAYFAIR': 'home',
    'OVERSTOCK': 'storefront',
    
    // Social Media & Communication
    'META': 'people',
    'TWTR': 'chatbubbles',
    'SNAP': 'camera',
    'PINTEREST': 'image',
    'LINKEDIN': 'business',
    'TIKTOK': 'musical-notes',
    'DISCORD': 'chatbubbles',
    
    // Transportation & Automotive
    'TSLA': 'car-electric',
    'UBER': 'car',
    'LYFT': 'car',
    'FORD': 'car',
    'GM': 'car',
    'TOYOTA': 'car',
    'HONDA': 'car',
    'BMW': 'car-sport',
    'FERRARI': 'car-sport',
    'NIO': 'car-electric',
    'RIVN': 'car-electric',
    'LCID': 'car-electric',
    
    // Entertainment & Media
    'NFLX': 'tv',
    'DIS': 'film',
    'SPOT': 'musical-notes',
    'TENCENT': 'game-controller',
    'ROKU': 'tv',
    'WARNER': 'film',
    'PARAMOUNT': 'film',
    'SONY_ENT': 'musical-notes',
    
    // Financial Services & Banking
    'JPM': 'business',
    'BAC': 'business',
    'WFC': 'business',
    'GS': 'business',
    'MS': 'business',
    'C': 'business',
    'USB': 'business',
    'PNC': 'business',
    'TD': 'business',
    'RY': 'business',
    
    // Payment & Fintech
    'V': 'card',
    'MA': 'card',
    'AXP': 'card',
    'PYPL': 'wallet',
    'SQ': 'calculator',
    'COIN': 'wallet',
    'SOFI': 'wallet',
    'AFFIRM': 'card',
    'KLARNA': 'card',
    
    // Healthcare & Pharmaceuticals
    'JNJ': 'medical',
    'PFE': 'medical',
    'UNH': 'medical',
    'MRNA': 'medical',
    'NOVAVAX': 'medical',
    'ABBV': 'medical',
    'ROCHE': 'medical',
    'NOVARTIS': 'medical',
    'MERCK': 'medical',
    'GILD': 'medical',
    'BIOGEN': 'medical',
    
    // Energy & Oil
    'XOM': 'flame',
    'CVX': 'flame',
    'BP': 'flame',
    'SHELL': 'flame',
    'TOTAL': 'flame',
    'COP': 'flame',
    'EOG': 'flame',
    'SLB': 'flame',
    
    // Consumer Goods & Beverages
    'COCA': 'wine',
    'PEP': 'wine',
    'KO': 'wine',
    'MONSTER': 'wine',
    'REDBULL': 'wine',
    
    // Fashion & Sports
    'NIKE': 'footsteps',
    'ADIDAS': 'footsteps',
    'PUMA': 'footsteps',
    'UNDER_ARMOUR': 'footsteps',
    'LULU': 'shirt',
    'GAP': 'shirt',
    'H&M': 'shirt',
    'ZARA': 'shirt',
    
    // Food & Restaurants
    'MCD': 'restaurant',
    'SBUX': 'cafe',
    'YUM': 'restaurant',
    'CMG': 'restaurant',
    'DOMINOS': 'pizza',
    'PAPA_JOHNS': 'pizza',
    'SUBWAY': 'restaurant',
    'KFC': 'restaurant',
    
    // Aviation & Travel
    'BA': 'airplane',
    'UAL': 'airplane',
    'DAL': 'airplane',
    'AAL': 'airplane',
    'LUV': 'airplane',
    'AIRBUS': 'airplane',
    'BOOKING': 'bed',
    'EXPEDIA': 'bed',
    'MARRIOTT': 'bed',
    'HILTON': 'bed',
    
    // Gaming & Entertainment
    'ACTIVISION': 'game-controller',
    'EA': 'game-controller',
    'UBISOFT': 'game-controller',
    'ROBLOX': 'game-controller',
    'UNITY': 'game-controller',
    'TAKE_TWO': 'game-controller',
    
    // Indian Stocks
    'RELIANCE': 'flame',
    'TCS': 'desktop',
    'HDFCBANK': 'business',
    'INFY': 'desktop',
    'ICICIBANK': 'business',
    'HINDUNILVR': 'bag',
    'SBIN': 'business',
    'BHARTIARTL': 'call',
    'ITC': 'wine',
    'KOTAKBANK': 'business',
    'LT': 'construct',
    'ASIANPAINT': 'brush',
    'AXISBANK': 'business',
    'MARUTI': 'car',
    'SUNPHARMA': 'medical',
    'TITAN': 'watch',
    'BAJFINANCE': 'business',
    'ULTRACEMCO': 'construct',
    'ONGC': 'flame',
    'POWERGRID': 'flash',
    'NTPC': 'flash',
    'COALINDIA': 'hammer',
    'TECHM': 'desktop',
    'HCLTECH': 'desktop',
    'WIPRO': 'desktop',
    'DRREDDY': 'medical',
    'CIPLA': 'medical',
    'TATASTEEL': 'hammer',
    'HINDALCO': 'hammer',
    'JSWSTEEL': 'hammer',
    'VEDL': 'hammer',
    'BAJAJFINSV': 'business',
    'M&M': 'car',
    'EICHERMOT': 'car',
    'HEROMOTOCO': 'car',
    'BAJAJ-AUTO': 'car',
    'TATAPOWER': 'flash',
    'ADANIPORTS': 'boat',
    'ADANIGREEN': 'leaf',
    'ADANIENT': 'business',
    'GODREJCP': 'bag',
    'NESTLEIND': 'wine',
    'BRITANNIA': 'wine',
    'DABUR': 'medical',
    'MARICO': 'bag',
    'COLPAL': 'bag',
    
    // Default fallback - use building/business icon for unrecognized tickers
  };
  
  // Array of random icons for unknown stocks
  const randomIcons = [
    'analytics', 'bar-chart', 'trending-up', 'pulse', 'diamond', 'star',
    'flash', 'rocket', 'shield', 'trophy', 'globe', 'briefcase',
    'layers', 'grid', 'settings', 'cog', 'hammer', 'construct',
    'leaf', 'water', 'sunny', 'cloud', 'thunderstorm', 'snow',
    'cafe', 'restaurant', 'wine', 'pizza', 'fast-food', 'ice-cream',
    'library', 'school', 'book', 'newspaper', 'journal', 'document',
    'images', 'camera', 'color-palette', 'brush', 'pencil', 'create',
    'musical-notes', 'headset', 'radio', 'tv', 'videocam', 'film',
    'boat', 'train', 'bus', 'bicycle', 'walk', 'fitness',
    'heart', 'pulse', 'bandage', 'thermometer', 'eyedrop', 'pill',
    'home', 'business', 'storefront', 'bag', 'basket', 'gift'
  ];
  
  const upperTicker = ticker?.toUpperCase() || '';
  
  if (iconMap[upperTicker]) {
    return iconMap[upperTicker];
  }
  
  // RANDOMIZE THE ICONS IF NO MATCH
  let hash = 0;
  for (let i = 0; i < upperTicker.length; i++) {
    const char = upperTicker.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const randomIndex = Math.abs(hash) % randomIcons.length;
  return randomIcons[randomIndex];
};

export default { getStockIcon }; 