import { Colors } from "@/constants/Colors";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { useEffect, useState } from "react";
import { Pressable, Text, useColorScheme, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { IconSymbol } from "./IconSymbol";

type UiErrorMessage = {
  id: number;
  message: string;
};

type UiErrorListener = (messages: UiErrorMessage[]) => void;

let nextId = 1;
let messages: UiErrorMessage[] = [];
const listeners = new Set<UiErrorListener>();

function emit() {
  listeners.forEach((listener) => listener(messages));
}

export function uiError(message: string | null | undefined) {
  if (!message) return;

  messages = [
    ...messages,
    {
      id: nextId++,
      message,
    },
  ];
  emit();
}

function removeUiError(id: number) {
  messages = messages.filter((message) => message.id !== id);
  emit();
}

function subscribeUiErrors(listener: UiErrorListener) {
  listeners.add(listener);
  listener(messages);

  return () => {
    listeners.delete(listener);
  };
}

function ErrorMessageItem({
  item,
  onClose,
  alignLeft,
}: {
  item: UiErrorMessage;
  onClose: () => void;
  alignLeft: boolean;
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  function close() {
    opacity.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(50, { duration: 300 });
    setTimeout(onClose, 300);
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    translateY.value = withTiming(0, { duration: 200 });
    const timeout = setTimeout(close, 15000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[{
        width: '100%',
        paddingHorizontal: 10,
      }, animatedStyle]}>
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            paddingVertical: 10,
            paddingLeft: 12,
            paddingRight: 8,
            borderRadius: 8,
            alignItems: 'flex-start',
            alignSelf: alignLeft ? 'flex-start' : 'center',
            backgroundColor: colorScheme === 'dark' ? '#2b1517' : '#fff',
            borderColor: colorScheme === 'dark' ? '#613033' : '#f3c7c7',
            borderWidth: 1,
            minHeight: 48,
            maxWidth: 600,
            width: '100%',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: colorScheme === 'dark' ? .35 : .18,
            shadowRadius: 18,
            elevation: 8,
          }}>
          <Text
            style={{
              color: colorScheme === 'dark' ? theme.errorText : theme.text,
              flex: 1,
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 19,
            }}>{item.message}</Text>
          <Pressable
            hitSlop={8}
            style={{
              width: 28,
              height: 28,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              marginTop: -4,
            }}
            onPress={() => {
              close();
            }}>
            <IconSymbol name="xmark" color={colorScheme === 'dark' ? theme.errorText : theme.text} size={16}/>
          </Pressable>
        </View>
    </Animated.View>
  );
}

export function ErrorMessage() {
  const dynamicSide = useDynamicSide();
  const { width } = useWindowDimensions();
  const [items, setItems] = useState<UiErrorMessage[]>([]);
  const alignLeft = width >= 750;

  useEffect(() => subscribeUiErrors(setItems), []);

  if (items.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        bottom: dynamicSide.bottom + 50 + 15,
        left: 0,
        zIndex: 1000,
        width: '100%',
        gap: 8,
        alignItems: alignLeft ? 'flex-start' : 'center',
        paddingLeft: alignLeft ? dynamicSide.left + 10 : 0,
      }}>
      {items.map((item) => (
        <ErrorMessageItem
          key={item.id}
          item={item}
          onClose={() => removeUiError(item.id)}
          alignLeft={alignLeft}
        />
      ))}
    </View>
  );
}
