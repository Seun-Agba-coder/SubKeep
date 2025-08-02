import { Snackbar } from 'react-native-paper';
import { useState } from 'react';


interface SnackBarProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    message: string;
    color: string;
}


const SnackBarBottom = ({visible, setVisible, message ,color}: SnackBarProps) =>  {
  
    return (
            <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            duration={3000}
            style={{backgroundColor: color}}
            theme={{
                colors: {
                  inverseOnSurface: 'white', // Text color
                }
              }}
      >
        {message}
      </Snackbar>

    )
}


export default SnackBarBottom
