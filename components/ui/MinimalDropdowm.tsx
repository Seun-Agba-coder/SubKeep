import { setMode } from '@/redux/AppSlice';
import { useAppDispatch } from '@/redux/hooks';
import { saveTheme } from '@/utils/SavedTheme';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Menu } from 'react-native-paper';
import IconButton from './IconButton';

interface MinimalDropdowmProp {
    list: { name: string; value: string }[];
    theme: any;
    label: string;
    selected?: string;
    visible?: boolean;
    setVisible?: (value: boolean) => void;
    setSelected?: React.Dispatch<React.SetStateAction<string>>;
    systemChange?: boolean;
    lang?: boolean;
}

const MinimalDropdown = ({ list, theme, label, selected, setSelected, visible, setVisible, systemChange, lang }: MinimalDropdowmProp) => {
    const dispatch = useAppDispatch()



    return (
        <Menu
            visible={visible || false}
            onDismiss={() => setVisible?.(false)}
            anchor={
                <View style={styles.container}>
                    <Text style={[styles.label, { color: theme.primaryText }]}>{selected}</Text>
                    <IconButton name="caret-down-outline" size={17} color={theme.primaryText} onPress={() => setVisible && setVisible(!visible)} />
                </View>
            }
            contentStyle={{
                backgroundColor: theme.secondaryColor,
                borderRadius: 10,
                width: 100
            }}
        >
            {list.map((item: any) => {

                return <Menu.Item onPress={async (e) => {
                    e.preventDefault();
                    if (setSelected) {
                        if (lang) {
                             const name = await item.onPress()
                             setSelected(name)
                        }
                        setSelected(item.value)
                    }
                    if (setVisible) {
                        setVisible(false)
                    }
                    if (systemChange) {
                        console.log(item.code, ": : item pressed code ")
                        await saveTheme(item.code)
                        dispatch(setMode({ mode: item.code }));
                        router.replace("/(tab)/Setting")
                    }
                }} title={item?.name} key={item.name} titleStyle={{ fontSize: 14, color: selected === item.name ? theme.primaryText : theme.secondaryText }} />
            })}



        </Menu>

    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 4,
        borderBottomWidth: 1,
        width: 90,
        justifyContent: 'center'

    },
    label: {
        fontSize: 10
    },
    title: {
        fontSize: 10
    }
});

export default MinimalDropdown;
