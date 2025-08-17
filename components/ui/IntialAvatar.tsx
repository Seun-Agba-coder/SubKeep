import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InitialAvatar = ({ name, size = 50, color = '#6733b9'}: { name: string; size?: number; color?: string}) => {
  if (!name) {
    return null; 
  }

  // Extract the first letter of each word in the name
  const initials = name
    .split(' ')
    .map((word: string) => word.charAt(0))
    .join('')
    .toUpperCase()


  return (
    <View style={[styles.container, { 
      width: size, 
      height: size, 
      borderRadius: size / 2, 
      backgroundColor: color 
    }]}>
      <Text style={[styles.initialsText, { 
        fontSize: size / 2.5 
      }]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // Default styling, can be overridden by props
  },
  initialsText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default InitialAvatar;