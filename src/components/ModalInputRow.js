import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

const ModalInputRow = ({ value, onChangeText, onAdd, placeholder = 'Add Watchlist Name', theme, style = {}, inputStyle = {}, buttonStyle = {}, buttonTextStyle = {} }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }, style]}>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[{ flex: 1, backgroundColor: theme.background, borderColor: theme.border, color: theme.text, borderWidth: 1, borderRadius: 8, padding: 10, marginRight: 8 }, inputStyle]}
      placeholderTextColor={theme.secondaryText}
    />
    <TouchableOpacity onPress={onAdd} style={[{ backgroundColor: '#11B981', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 }, buttonStyle]}>
      <Text style={[{ color: 'white', fontWeight: 'bold' }, buttonTextStyle]}>Add</Text>
    </TouchableOpacity>
  </View>
);

export default ModalInputRow; 