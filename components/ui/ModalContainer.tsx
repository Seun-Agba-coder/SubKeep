import {Text, View, Modal, StyleSheet } from 'react-native'
import PressableText from './PressableText'
import { cancelNotification } from '@/utils/EnableNotification'
import { ThemeContext } from '@react-navigation/native';
import { useAppTranslation } from '@/hooks/useAppTranslator';

interface ModalContainerProps {
    visible: boolean,
    setVisible: (value: boolean) => void,
    actionText: string, 
    title: string;
    body: string;
    theme: any;
    actionHandler: () => void
}

const ModalContainer = ({visible, setVisible, actionText, body, theme, actionHandler, title}: ModalContainerProps) => {

    const {t} = useAppTranslation()
    function cancelModalHandler() {
        setVisible(false)
    }

    function actionInsideHandler() {
        actionHandler()
        setVisible(false)
    }
    return (
        <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.modalContainer, {backgroundColor: theme.background}]}>
            <Text style={[  styles.titleText, {color: theme.primaryText}]}>{title}</Text>
            <Text style={[styles.body, {color: theme.primaryText}]}>{body}</Text>
            <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                <View style={{flexDirection: 'row', gap: 10}}>
                    <PressableText extraTextStyle={{marginRight: 10, color: theme.primaryText}} onPress={() => cancelModalHandler()}>{t('common.cancel')}</PressableText>
                    <PressableText extraTextStyle={{marginRight: 10, color: theme.secondaryColor, fontWeight: '700'}} onPress={() => actionInsideHandler()}>{actionText}</PressableText>
                </View>

               
            </View>
          </View>
        </View>
    </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 239, 239, 0.6)',
        justifyContent: 'center', 
        alignItems: 'center'
    },
    modalContainer: {
        width: '80%',
        padding: 20, 
        borderRadius: 20,
    }, 
    titleText: {
        fontSize: 18,
        fontWeight: '700', 
        paddingVertical: 10, 
    }, 
    body: {
        fontSize: 13,
        paddingBottom: 15,
    }
})


export default ModalContainer