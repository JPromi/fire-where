import { Colors } from '@/constants/Colors';
import { Text, useColorScheme, View } from 'react-native';
import { IconSymbol } from './IconSymbol';

export function TagChip({
  name,
  icon,
  tagColor,
}: {
  name: string;
  icon?: any;
  tagColor?: string;
}) {
  const colorScheme = useColorScheme()
  const tagColorFinal = tagColor || Colors[colorScheme ?? 'light'].opTechnical;
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: tagColorFinal + '30',
      borderRadius: 16,
      paddingVertical: 6,
      paddingHorizontal: 10,
      userSelect: 'none',
    }}>
      {icon && (
        <IconSymbol name={icon} size={18} color={tagColorFinal} />
      )}
      <Text style={{
        fontSize: 14,
        color: tagColorFinal,
      }}>{name}</Text>
    </View>
  );
}
