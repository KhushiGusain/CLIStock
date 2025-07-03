import React from 'react';
import { View, Text } from 'react-native';

const CompanyInfoRow = ({ label, value, theme, style = {}, labelStyle = {}, valueStyle = {} }) => (
  <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }, style]}>
    <Text style={[{ color: theme.secondaryText, fontSize: 14 }, labelStyle]}>{label}</Text>
    <Text style={[{ color: theme.text, fontSize: 14, fontWeight: 'bold' }, valueStyle]}>{value}</Text>
  </View>
);

export default CompanyInfoRow; 