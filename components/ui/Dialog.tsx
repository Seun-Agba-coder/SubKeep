import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

interface DialogModalProps {
  theme: any;
  title: string;
  content: string;
  action: () => void;
  actionText: string;
  visible: boolean;
  setVisible: (value: boolean) => void; 
}

export default function DialogModal({theme, title, content, action, actionText, visible, setVisible}: DialogModalProps) {
 
    const hideDialog = () => setVisible(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: theme.secondaryColor }}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={{ borderRadius: 20 }}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <Text>{content}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={  hideDialog}>Cancel</Button>
            <Button onPress={action}>{actionText}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
