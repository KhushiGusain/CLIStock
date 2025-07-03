import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const Loader = ({ message = 'Loading...', color = '#11B981', textColor = '#969696', style = {} }) => (
  <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, style]}>
    <ActivityIndicator size="large" color={color} />
    <Text style={{ marginTop: 16, fontSize: 16, color: textColor }}>{message}</Text>
  </View>
);

export default Loader; 