import { Ionicons as IoniconsType } from '@expo/vector-icons';
import { Pressable } from 'react-native';

interface Props {
    name: keyof typeof IoniconsType.glyphMap;
    size: number;
    color?: string;
    onPress?: () => void;
}


const IconButton = ({ name, size, color, onPress }: Props) => {
    return (
        <Pressable style={({ pressed }) => pressed && { opacity: 0.5 }} onPress={onPress}>
            <IoniconsType name={name} size={size} color={color} />
        </Pressable>
    )
}


export default IconButton