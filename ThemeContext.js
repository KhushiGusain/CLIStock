import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const lightTheme = {
  mode: 'light',
  background: '#F7F9FA',
  card: '#FFFFFF',
  text: '#222B45',
  secondaryText: '#969696',
  accent: '#11B981',
  border: '#E6F4F8',
  input: '#FFFFFF',
  price: '#222B45',
  iconBackground: '#F3F6FA',
  gainersPercentageBg: '#E6F9F2',
  losersPercentageBg: '#FDEEEF',
};

const darkTheme = {
  mode: 'dark',
  background: '#181A20',
  card: '#141414',
  text: '#FFFFFF',
  secondaryText: '#969696',
  accent: '#11B981',
  border: 'rgba(255, 255, 255, 0.4)',
  input: '#23262F',
  price: '#FFFFFF',
  iconBackground: '#374151',
  gainersPercentageBg: '#292b2a',
  losersPercentageBg: '#292b2a',
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme(prev => (prev.mode === 'light' ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 