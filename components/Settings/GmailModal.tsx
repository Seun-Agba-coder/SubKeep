import {View, Text, Modal, StyleSheet} from 'react-native';
import PressableText from '../ui/PressableText';

interface GmailModalProps {
    modalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    title: string;
    subtitle: string;
    theme: any;
}

const GmailModal = ({modalVisible, setModalVisible, title, subtitle, theme}: GmailModalProps) => {
  console.log("SubTitle: :", subtitle)
      return (
        <Modal
        animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(!modalVisible);
  }}>
     <View style={styles.centeredView}>
    <View style={[styles.modalView, {backgroundColor: theme.background, borderRadius: 20, }]}>
      <Text style={[styles.title, {color: theme.primaryColor}]}>{title}</Text>
      <Text style={[styles.subTitle, {color: theme.primaryColor}]}>
        {subtitle}
      </Text>
      <View style={{alignItems: 'flex-end'}}>
     <PressableText extraTextStyle={{color: 'green'}} onPress={() => setModalVisible(false)}>
        Cancel
     </PressableText>
      </View>
     
    </View>
  </View>

        </Modal>
      )
}


const styles = StyleSheet.create({
    centeredView: {
     alignItems: 'center', 
     justifyContent: 'center',
     backgroundColor: 'rgba(255, 239, 239, 0.4)',
     flex: 1, 
    }, 
 
    modalView: {
     width: '80%', 
     padding: 15, 
     borderRadius: 15, 
    }, title : {
        padding: 4,
        fontSize: 15,
        fontWeight: '600'
    },
    subTitle: {
        fontSize: 13, 
        fontWeight: '100',
        color: 'gray'
    }
 })
 

 export default GmailModal
 