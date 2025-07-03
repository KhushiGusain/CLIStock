import React from 'react';
import { View, Text } from 'react-native';

const MetricCard = ({ label, value, theme, style = {}, labelStyle = {}, valueStyle = {} }) => (
  <View style={[{ borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E6F4F8', backgroundColor: theme.card }, style]}>
    <Text style={[{ color: theme.secondaryText, fontSize: 13 }, labelStyle]}>{label}</Text>
    <Text style={[{ color: theme.text, fontSize: 16, fontWeight: 'bold', marginTop: 2 }, valueStyle]}>{value}</Text>
  </View>
);

export default MetricCard; 