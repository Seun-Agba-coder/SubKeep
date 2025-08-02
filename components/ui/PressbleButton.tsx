import React from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";

const PressableButton = ({ onPress, label, extraTextStyle}: any) => {
    return (
        <Pressable
            style={({ pressed }) => [
                pressed && styles.pressed
            ]}
            onPress={onPress}
        >
                <Text style={[styles.text, extraTextStyle]}> {label} </Text>
       
            
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
    },
    text: {
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.5
    }
});

export default PressableButton