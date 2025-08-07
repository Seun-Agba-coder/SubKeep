import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, View, Image, Platform} from 'react-native';

type FilledButtonProps = {
  title: string;
  onPress?: () => void;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  src?: any

};

const CustomButton: React.FC<FilledButtonProps> = ({
  title,
  onPress,

  
  textColor = '#ffffff',
  style,
  textStyle,
  src
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [ pressed && {opacity: 0.1}]}
  

    >
      <View style={[styles.button, style]}>
      
        <Text style={[styles.text, { color: textColor }, textStyle]}>
          {title}
        </Text>
        {src && (
          Platform.OS === 'android' 
            ? <Image source={require("../../assets/AppImages/googlelogo.webp")} style={{width: 20, height: 20}}/>
            : <Image source={require("../../assets/AppImages/AppleLogo.png")} style={{width: 20, height: 20}}/>
        )}
      </View>
     
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
 
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomButton;
