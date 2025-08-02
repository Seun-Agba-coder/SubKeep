import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Modal } from 'react-native';

export default function ToogleButton({label, theme, isSet, setIsSet, fttoogle}: any) {
 
 
  

  return (
    <View style={styles.container}>
      {/* Free Trial Toggle */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.primaryText }]}>{label}</Text>
        <Switch
          value={isSet}
          onValueChange={(value) => setIsSet(value, fttoogle)}
          trackColor={{ false: '#777', true: '#B47DFF' }}
          thumbColor={isSet ? '#fff' : '#ccc'}
        />
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 30, 
    marginVertical: 10,
    
  },
  label: {
    fontSize: 16,
  },
});



