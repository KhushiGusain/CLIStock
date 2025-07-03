import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const TimeframeButton = ({ label, active, onPress, style = {}, textStyle = {} }) => (
  <TouchableOpacity
    style={[{
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: active ? '#E6F9F2' : 'transparent',
      marginRight: 8,
    }, style]}
    onPress={onPress}
  >
    <Text style={[{ fontWeight: 'bold', color: active ? '#11B981' : '#969696', fontSize: 13 }, textStyle]}>{label}</Text>
  </TouchableOpacity>
);

export default TimeframeButton; 