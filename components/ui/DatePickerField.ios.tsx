import { Colors } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRef, useState } from "react";
import { Platform, Pressable, StyleProp, useColorScheme, View, ViewStyle } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { ThemedText } from "../ThemedText";

export function DatePickerField({ value, onChange, canUndefined = false, style, maxDate, minDate }: {
  canUndefined?: boolean;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  style?: StyleProp<ViewStyle>;
  maxDate?: Date;
  minDate?: Date;
}) {
  const ref = useRef<ActionSheetRef>(null);
  const [tmp, setTmp] = useState(value);
  const colorScheme = useColorScheme();

  // ToDo: Translat
  return (
    <View style={style}>
      <Pressable
        onPress={() => { setTmp(value); ref.current?.show(); }}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: Colors[colorScheme ?? 'light'].backgroundForgroundBorder,
          borderRadius: 8,
          backgroundColor: Colors[colorScheme ?? 'light'].backgroundForground,
        }}>
        <ThemedText>{value?.toLocaleDateString() ?? "Kein Datum"}</ThemedText>
      </Pressable>

      <ActionSheet
        ref={ref}
        gestureEnabled={true}
        containerStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}
        indicatorStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].textSub, marginTop: 12 }}>
        <View style={{ padding: 12, backgroundColor: 'transparent',display: 'flex', gap: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            { canUndefined ? (
              <Pressable onPress={() => { onChange(undefined); ref.current?.hide(); }} style={{ padding: 4 }}>
                <ThemedText style={{ fontWeight: "600" }}>Löschen</ThemedText>
              </Pressable>
            ) : (
              <View />
            )}
            <Pressable onPress={() => { onChange(tmp); ref.current?.hide(); }} style={{ padding: 4 }}>
              <ThemedText style={{ fontWeight: "600" }}>Fertig</ThemedText>
            </Pressable>
          </View>

          <DateTimePicker
            value={tmp || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, d) => d && setTmp(d)}
            maximumDate={maxDate}
            minimumDate={minDate}
            style={{ minWidth: '100%', maxWidth: '100%' }}
          />
        </View>
      </ActionSheet>
    </View>
  );
}
