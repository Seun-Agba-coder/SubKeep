import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { Text, } from 'react-native-paper';
import { View } from 'react-native';

const Index = () => {
    console.log("APP COMPONENT LOADED")
    useEffect(() => {
        const checkDefaultCurrency = async () => {
            const defaultCurrency = await SecureStore.getItemAsync("defaultCurrency");
            if (!defaultCurrency) {
                router.replace("./(auth)/OnBoarding");
            } else {
                router.replace("./(tab)/Index");
            }
        };
        checkDefaultCurrency();
    }, []);

    return null;
};

export default Index;