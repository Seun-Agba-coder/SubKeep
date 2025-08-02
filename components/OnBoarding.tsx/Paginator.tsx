import { View, StyleSheet, Animated, useWindowDimensions} from 'react-native';


const Paginator = ({data, scrollX}: any) => {

    const { width } = useWindowDimensions();

    return (
        <View style={styles.container}>
             {
               
                data.map((_: any, i: any) => {
                    const inputRange = [(i-1) * width, i * width, (i+1) * width];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [10, 20, 10],
                        extrapolate: 'clamp'
                    })
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    })
                    return <Animated.View key={i.toString()} style={[styles.dot, {width: dotWidth, opacity}]} />
                    
                })
             }
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
       
        bottom: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 20,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#66A1F0',
        marginHorizontal: 5
    },
    
})


export default Paginator;