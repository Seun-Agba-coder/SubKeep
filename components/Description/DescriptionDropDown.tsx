import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import IconButton from '../ui/IconButton';

const ActionDropdown = ({item, theme}: any) => {
  const handleEdit = () => {
    Alert.alert('Edit', 'Edit action pressed');
    // Add your edit logic here
  };

  const handleDelete = () => {
    Alert.alert('Delete', 'Delete action pressed');
    // Add your delete logic here
  };

  const handleOtherAction = () => {
    Alert.alert('Other Action', 'Other action pressed');
    // Add your other action logic here
  };

  return (
    <MenuProvider>
      <View>
        <Menu>
          <MenuTrigger >
           {/* <IconButton name="ellipsis-vertical" size={34} color={theme.primaryText} /> */}
           <Text style={{color: theme.primaryText}}>;;</Text>
          </MenuTrigger>
          
          <MenuOptions >
            <MenuOption onSelect={handleEdit} style={styles.menuOption}>
              <Text style={[styles.menuText, {color: theme.primaryText}]}>📝 Edit Screen</Text>
            </MenuOption>
            
            <MenuOption onSelect={handleDelete} style={styles.menuOption}>
              <Text style={[styles.menuText, {color: theme.primaryText}]}>🗑️ Delete Screen</Text>
            </MenuOption>
            
            <MenuOption onSelect={handleOtherAction} style={styles.menuOption}>
              <Text style={[styles.menuText, {color: theme.primaryText}]}>⚙️ Settings</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  trigger: {
    padding: 0,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  triggerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuOptions: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
   
  },
});

export default ActionDropdown;
