import IconButton from "@/components/ui/IconButton";
import { DarkTheme, LightTheme } from '@/constants/Styles/AppStyle';
import { useAppSelector } from "@/redux/hooks";
import { router, Tabs } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppTranslation } from "@/hooks/useAppTranslator";



const TabLayout = () => {
    const mode = useAppSelector((selector) => selector.appmode.mode)
    const {t } = useAppTranslation()

    const theme = mode === 'light' ? LightTheme : DarkTheme;




    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Tabs screenOptions={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: theme.background,

                    },
                    tabBarStyle: {
    
                        backgroundColor: theme.background,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        position: 'absolute', // Important
                        elevation: 0, // Android shadow fix
                        borderTopWidth: 0, // remove default border
                        height: 70,
                    },
                    tabBarActiveTintColor: '#ff4081',
                    tabBarInactiveTintColor: theme.primaryText,
                    headerTitleStyle: {
                        color: theme.primaryText,
                    },
                    headerTintColor: theme.primaryText,
                   
                 

                }}>
                    <Tabs.Screen name="Index"
                        options={{
                            title: "Subscription.Ai", headerTitleStyle: {
                                fontSize: 27,
                                paddingHorizontal: 10,

                            },
                            tabBarLabel: t('bottomtablabels.subscriptions'),
                            tabBarIcon: ({ size, color}) => (
                                         <IconButton name="home" size={size} color={color} onPress={() => router.push("./Index")} />
                            )
                        }} />


                        <Tabs.Screen name="AllSubscription" options={{
                        tabBarIcon: ({ size, color, focused }) => (
                                <IconButton name="card-outline" size={size} color={color} onPress={() => router.push("./AllSubscription")} />
                           
                        ),
                        tabBarLabel: t('bottomtablabels.AllSubscription')


                    }} />

                < Tabs.Screen name="Fake" options={{
                        tabBarIcon: ({ focused }) => (
                            <IconButton name="add" size={36} color="white" />
                        ),
                        tabBarButton: (props: any) => (
                            <TouchableOpacity {...props} style={styles.floatingButtonContainer} onPress={() => { router.push('../(stack)/AddSub') }}>
                                <View style={styles.floatingButton}>
                                    <IconButton name="add" size={36} color="white"/>
                                </View>
                            </TouchableOpacity>
                        )
                    }} />

                <Tabs.Screen name="Analytics"
                        options={{
                            title: "Subscription.Ai", headerTitleStyle: {
                                fontSize: 27,
                                paddingHorizontal: 10,

                            },
                            tabBarLabel: t('bottomtablabels.Analytics'),
                            tabBarIcon: ({ size, color}) => (
                                 <TouchableOpacity
                                 hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                 > 
                                        <MaterialIcons name="analytics" size={size} color={color} onPress={() => router.push("./Analytics")}/>
                                </TouchableOpacity>
                            )
                        }} />

                    <Tabs.Screen name="Setting" options={{
                        tabBarIcon: ({ size, color, focused }) => (
                            <TouchableOpacity
                            >
                                <IconButton name="settings" size={size} color={color} onPress={() => router.push("./Setting")}/>
                            </TouchableOpacity>
                        ),
                        tabBarLabel: t('bottomtablabels.Setting')
                    }} />

                </Tabs>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}


const styles = StyleSheet.create({
    floatingButtonContainer: {
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',


    },
    floatingButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2f80ed',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6.27,
        elevation: 10
    }
});

export default TabLayout;