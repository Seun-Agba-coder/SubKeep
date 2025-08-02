import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AccessBox from '@/components/AccessBox';
import { router } from 'expo-router';

const AccessScreen = () => {

    const connectGmail = () => {
    }

    const skipForNow = () => {
        router.replace("/Index")
    }
  return (
    <View style={styles.container}>
      <View style={styles.AccessBoxContainer}>
       <AccessBox connectGmail={connectGmail} skipForNow={skipForNow} />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30, 
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  AccessBoxContainer: {
    elevation: 1,
    borderRadius: 7,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  
}}
);

export default AccessScreen;
