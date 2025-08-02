import React from 'react';
import {  View, StyleSheet, Text } from 'react-native';
import IconButton from '@/components/ui/IconButton';



interface HeaderComponentProps {
  onPress: () => void;
  icon: any;
  color?: string;
  leftText?: string;
  rightText?: string;
  size: number;

}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ onPress, color = 'white', icon, leftText, rightText, size}) => {
  return (
   <View style={styles.container}>
    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10}}>
    <View>
        <IconButton
            name={icon}
            color={color}
            onPress={onPress}
            size={size}
        />
    </View>
    <View>
        <Text
            style={[styles.leftText, {color: color}]}
        >
            {leftText}
        </Text>
    </View>
    </View>


    <View>
        <Text style={[styles.rightText, {color: color}]}>{rightText}</Text>
    </View>

   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftText: {
    fontSize: 15,
    fontWeight: 'light',

  },
  rightText: {
    fontSize: 18,
    fontWeight: 'bold',
   

  }

});

export default HeaderComponent;