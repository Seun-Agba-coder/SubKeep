import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useAppTranslation } from '@/hooks/useAppTranslator';




const DropDownMenu = ({theme, selectedPeriod, setSelectedPeriod}: any) => {

  const {t } = useAppTranslation()

  const data = [
    { label: t('addsub.notificationscreen.dropdown.week'), value: "Week" },
    { label: t('addsub.notificationscreen.dropdown.month'), value: "Month" },
    { label: t('addsub.notificationscreen.dropdown.year'), value: "Year" },
    { label: t('addsub.notificationscreen.dropdown.onetime'), value: "One Time" },
  ];
  


  return (
    <View style={[styles.container, {backgroundColor: theme.secondaryColor, justifyContent: 'center'}]}>
      <Dropdown
        style={[styles.dropdown, {backgroundColor: theme.secondaryColor}]}
        data={data}
        labelField="label"
        valueField="value"
        value={selectedPeriod.value}
        onChange={item => setSelectedPeriod({value: item.value, label: item.label})}
        selectedTextStyle={{color: theme.primaryText}}
        
      />
    </View>
  );
};



const styles= StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10
  },
  dropdown: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
   
  
  },
})

export default DropDownMenu;