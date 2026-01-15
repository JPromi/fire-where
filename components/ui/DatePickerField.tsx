import { useRef, useState } from "react";
import { StyleProp, useColorScheme, View, ViewStyle } from "react-native";
import { ActionSheetRef } from "react-native-actions-sheet";
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

  return (
    <View style={style}>
      <ThemedText>{value?.toLocaleDateString() ?? "Kein Datum"}</ThemedText>
    </View>
  );
}
