import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface InputTextProps extends TextInputProps {
    inputTitle?: string;
    inputTitleColor?: string;
    optional?: boolean;
    extraInputStyle?: any;
    optionalTextColor?: string;
}

const InputText = ({ inputTitle, inputTitleColor, optional, extraInputStyle, optionalTextColor, ...props }: InputTextProps) => {

    return (
        <View style={{marginVertical: 5}}>
            {inputTitle &&
                <View style={{ flexDirection: 'row', gap: 1 }}>
                    <Text style={[styles.textTitle, { marginBottom: 6, color: inputTitleColor }]}>{inputTitle} </Text>
                    {optional && <Text style={{ color: optionalTextColor }}> - optional</Text>}
                </View>
            }

            <TextInput {...props} style={[styles.textinput, extraInputStyle]} />
        </View>
    )
}

const styles = StyleSheet.create({
    textinput: {
        height: 60,
        borderRadius: 17,
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 5,
        color: 'white'
    }, 
    textTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default InputText