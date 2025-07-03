import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChartPlaceholder = ({ message = 'Chart data unavailable', subtext = 'Please try again later', iconName = 'show-chart', theme, style = {} }) => (
  <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 24 }, style]}>
    <Ionicons name={iconName} size={48} color={theme?.secondaryText || '#969696'} />
    <Text style={{ color: theme?.secondaryText || '#969696', fontSize: 16, marginTop: 8 }}>{message}</Text>
    {subtext ? <Text style={{ color: theme?.secondaryText || '#969696', fontSize: 13, marginTop: 2 }}>{subtext}</Text> : null}
  </View>
);

export default ChartPlaceholder; 