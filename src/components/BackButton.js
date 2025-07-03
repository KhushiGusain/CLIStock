import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BackButton = ({ onPress, icon, style = {}, iconStyle = {}, useIonicon = false }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    {useIonicon ? (
      <Ionicons name="arrow-back" size={28} style={iconStyle} />
    ) : (
      <Image source={icon} style={[{ width: 44, height: 44 }, iconStyle]} />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackButton; 