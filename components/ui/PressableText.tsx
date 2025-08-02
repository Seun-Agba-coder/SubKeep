import {Text, Pressable} from 'react-native'
import React from 'react'



interface PressableText {
    children: string,
    extraTextStyle: any
    onPress: () => void
}


const PressableText : React.FC<PressableText> = ({children, extraTextStyle, onPress}) => {
    return (
        <Pressable onPress={onPress} style={({pressed}) => pressed &&{ opacity: 0.5}}>
            <Text style={extraTextStyle}>{children}</Text>
        </Pressable>
    )
}

export default PressableText