import { Colors } from "@/constants/Colors";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { useEffect, useState } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { IconSymbol } from "./IconSymbol";

export function ErrorMessage({
  message
}: {
  message: string | null;
}) {

  const dynamicSide = useDynamicSide();
  const colorScheme = useColorScheme();

  const [messageVal, setMessageVal] = useState<string | null>(message);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {

    if (messageVal) {
      // Fade in
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });
    } else {
      // Fade out
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(50, { duration: 300 });
    }
  }, [messageVal]);

  useEffect(() => {
    setMessageVal(message);
  }, [message]);

  return (
    <Animated.View

      style={[{
        position: 'absolute',
        bottom: dynamicSide.bottom + 50,
        left: 0,
        zIndex: 1000,
        width: '100%',
        padding: 10,
      }, animatedStyle]}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            backgroundColor: Colors[colorScheme ?? 'light'].error,
            height: 40,
            maxWidth: 500,
            shadowColor: '#555',
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: .75,
            shadowRadius: 3,
          }}>
          <Text
            numberOfLines={1}
            lineBreakMode="tail"
            style={{
              color: Colors[colorScheme ?? 'light'].errorText,
              maxWidth: '80%'
            }}>{messageVal}</Text>
          <Pressable
            style={{
              width: 30,
              height: 30,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setMessageVal(null);
            }}>
            <IconSymbol name={'xmark'} color={Colors[colorScheme ?? 'light'].errorText} size={16}/>
          </Pressable>
        </View>
    </Animated.View>
  );
}