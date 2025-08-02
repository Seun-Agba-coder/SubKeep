import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Modal } from 'react-native';
import IconButton from '../ui/IconButton';
import { useAppSelector } from '@/redux/hooks';
import { useAppTranslation } from '@/hooks/useAppTranslator';

export const categories = [
  { icon: 'film', label: 'Entertainment & Streaming' },
  { icon: 'construct', label: 'Productivity & Tools' },
  { icon: 'cart', label: 'Shopping & Delivery' },
  { icon: 'wifi', label: 'Internet & Cloud' },
  { icon: 'fitness', label: 'Health & Wellness' },
  { icon: 'briefcase', label: 'Business & Marketing' },
  { icon: 'game-controller', label: 'Gaming & Virtual Goods' },
  { icon: 'shield-checkmark', label: 'Privacy & Security' },
  { icon: 'sparkles', label: 'AI & Developer Tools' },
  { icon: 'ellipsis-horizontal', label: 'Other' },
];


export default function CategoryDropdown({theme, selected, setSelected, editing}: any) {
 const mode = useAppSelector((selector) => selector.appmode.mode)
 const {t} = useAppTranslation()

 const categories = [
  { icon: 'film', label: t('addsub.category.Entertainment & Streaming'), labelkey: "Entertainment & Streaming"},
  { icon: 'construct', label: t('addsub.category.Productivity & Tools'), labelkey: "Productivity & Tools" },
  { icon: 'cart', label: t('addsub.category.Shopping & Delivery'), labelkey: "Shopping & Delivery" },
  { icon: 'wifi', label: t('addsub.category.Internet & Cloud'), labelkey: "Internet & Cloud" },
  { icon: 'fitness', label: t('addsub.category.Health & Wellness'), labelkey: "Health & Wellness" },
  { icon: 'briefcase', label: t('addsub.category.Business & Marketing'), labelkey: "Business & Marketing" },
  { icon: 'game-controller', label: t('addsub.category.Gaming & Virtual Goods'), labelkey: "Gaming & Virtual Goods" },
  { icon: 'shield-checkmark', label: t('addsub.category.Privacy & Security'), labelkey: "Privacy & Security" },
  { icon: 'sparkles', label: t('addsub.category.AI & Developer Tools'), labelkey: "AI & Developer Tools" },
  { icon: 'ellipsis-horizontal', label: t('addsub.category.Other'), labelkey: "Other" },
];





  const [isVisible, setVisible] = useState(false);


  return (
    <View >
      <Pressable onPress={() => setVisible(true)} style={[styles.selector, {backgroundColor: theme.secondaryColor}]}>
        <Text style={[styles.selectorText, {color: theme.primaryText}]}>
         {
          !editing.current ? selected ? selected.label : t('addsub.subquestion.category.placeholder') : t(`addsub.category.${selected}`)
         }
          
        </Text>
        <IconButton name="chevron-down" size={20} color="#888" />
      </Pressable>

      <Modal visible={isVisible}   onRequestClose={() => {
            setVisible(!isVisible);
          }}    transparent={true}>
        <View style={styles.centeredView}>

     
            <View style={{...styles.modalView, backgroundColor: mode === 'dark' ?theme.secondaryColor: 'white'}}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.label}
                renderItem={({ item }: any) => (
                <Pressable
                    style={[styles.item, {backgroundColor: mode === 'dark' ?theme.secondaryColor: 'white', gap: 20}]}
                    onPress={() => {
                    editing.current = false
                    setSelected(item)
                    setVisible(false);
                    }}
                >
                    <IconButton name={item.icon} size={20} color={mode === 'dark' ? 'white' : 'black'} />
                    <Text style={[styles.label, {color: theme.secondaryText}]}>{item.label}</Text>
                </Pressable>
                )}
            />
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
 
  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {

  
    borderRadius: 20,
    padding: 20,
    height: 600,
    maxHeight: '50%',
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',

  },
  label: { fontSize: 16 },
});
