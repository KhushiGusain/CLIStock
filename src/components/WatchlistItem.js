import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WatchlistItem = ({ name, selected, onPress, theme, style = {}, textStyle = {} }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: theme.background, borderRadius: 8, marginBottom: 8 }, style]}
  >
    <Text style={[{ color: theme.secondaryText, fontSize: 15 }, textStyle]}>{name}</Text>
    {selected ? <Ionicons name="checkmark" size={22} color="#11B981" /> : null}
  </TouchableOpacity>
);

export default WatchlistItem; 