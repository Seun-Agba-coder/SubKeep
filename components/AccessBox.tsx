import  { View, Text, StyleSheet } from 'react-native'
import IconButton from './ui/IconButton'
import React from 'react'
import CustomButton from './ui/CustomButton'

interface AccessBoxProps {
    connectGmail : () => void;
    skipForNow : () => void;    
}

const AccessBox = ({connectGmail, skipForNow}: AccessBoxProps) => {
    return (
        <View style={styles.container}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.iconContainer}>
                    <IconButton name="checkmark" size={30} color=""/>
                </View>
                <Text style={styles.title}> You're signed in</Text>
            </View>

            <View style={styles.secondaryContainer}>
                <Text style={styles.subTitle}> 
                    Connect Your Gmail to unlock Smart Tracking 
                </Text>
                <Text style={{marginVertical: 5}}>
                    Connect your Gmail Securely so we can scan for subscripiton
                    recripts and keep your dashboard up to date-no manual input needed.
                </Text>
                <Text style={styles.textNotice}>
                    We never send email or share your data.
                    This  is raed-only access.
                </Text>
                <Text style={styles.textNotice}>🔒 Google-verified. Safe. Private. Optional</Text>

                <View style={{marginVertical: 10}}>
                    <CustomButton title="Connect Gmail" onPress={connectGmail} style={styles.gmailButton} />
                </View>
                <View>
                    <CustomButton title="Skip for now" onPress={skipForNow} textColor="lightblue"/>
                </View>
                

        </View>
            


        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
       
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    gmailButton: {
       backgroundColor: 'blue', 
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'left',
    },  
    iconContainer: {
        backgroundColor: 'lightgreen',
        height: 50,
        width: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryContainer: {
       borderRadius: 8,
      
        padding: 10,
    },
    textNotice: {
        color: 'gray',
        fontSize: 15,
    }
  
 
})


export default AccessBox