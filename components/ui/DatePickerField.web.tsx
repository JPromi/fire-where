import { Colors } from "@/constants/Colors";
import { useEffect, useRef, useState } from "react";
import { StyleProp, useColorScheme, View, ViewStyle } from "react-native";
import { ActionSheetRef } from "react-native-actions-sheet";

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

  const [draft, setDraft] = useState(
    value ? value.toISOString().slice(0, 10) : ""
  );

  useEffect(() => {
    setDraft(value ? value.toISOString().slice(0, 10) : "");
  }, [value]);

  return (
    <View style={style}>
      <input
        className="datePickerInput"
        type="date"
        name="datePicker"
        id="datePicker"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}     // nur merken
        onBlur={() => onChange(draft ? new Date(draft) : undefined)} // erst hier übernehmen
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onChange(draft ? new Date(draft) : undefined);
            e.currentTarget.blur();
          }
        }}
        // if selected than change background color
        style={{
          borderRadius: 8,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: Colors[colorScheme ?? 'light'].backgroundForegroundBorder,
          backgroundColor: 'transparent',
          color: Colors[colorScheme ?? 'light'].text,
          padding: 8,
          outline: 'none',
        }}
        />
        <style>
          {` 
          input[type="date"].datePickerInput::-webkit-calendar-picker-indicator {
            filter: ${colorScheme === 'dark' ? 'invert(1)' : 'invert(0)'};
          }
          
          input[type="date"].datePickerInput:focus {
            background-color: ${Colors[colorScheme ?? 'light'].backgroundForeground} !important;
          }

          input[type="date"].datePickerInput {
            transition: background-color 150ms ease-in-out !important;
          },
          `}
        </style>
    </View>
  );
}
