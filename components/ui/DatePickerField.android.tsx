import { Colors } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable, StyleProp, useColorScheme, View, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import { IconSymbol } from "./IconSymbol";

type Props = {
  canUndefined?: boolean;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  style?: StyleProp<ViewStyle>;
  maxDate?: Date;
  minDate?: Date;
};

export function DatePickerField({ value, onChange, canUndefined = false, style, maxDate, minDate }: Props) {
  const [open, setOpen] = useState(false);
  const colorScheme = useColorScheme();

  return (
    <View style={style}>
      <View
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: Colors[colorScheme ?? 'light'].backgroundForegroundBorder,
          borderRadius: 8,
          backgroundColor: Colors[colorScheme ?? 'light'].backgroundForeground,
        }}>
        <Pressable
          onPress={() => setOpen(true)}>
          <ThemedText>{value ? value.toLocaleDateString() : "Datum wählen"}</ThemedText>
        </Pressable>
        { canUndefined && (
          <Pressable
            onPress={() => onChange(undefined)}
            style={{ position: 'absolute', right: 8, top: 8 }}>
            <IconSymbol name="xmark" color={Colors[colorScheme ?? 'light'].textSub} />
          </Pressable>
        )}
      </View>
      

      {open && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display="default"
          onChange={(event, selected) => {
            setOpen(false);
            if (event.type === 'dismissed') return
            if (selected) onChange(selected);
          }}
          maximumDate={maxDate}
          minimumDate={minDate}
        />
      )}
    </View>
  );
}
