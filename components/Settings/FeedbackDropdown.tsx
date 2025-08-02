import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View } from 'react-native';

export default function FeedbackDropdown({open, value, items, setOpen, setValue, setItems}: any) {

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select Feedback Type"
        style={{ borderColor: '#ccc', width: "auto", marginLeft: -20 , }}
        dropDownContainerStyle={{ borderColor: '#ccc' }}
      />
    </View>
  );
}
