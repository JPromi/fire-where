import { BlurView } from "expo-blur";
import { PropsWithChildren, RefObject } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type LiquidGlassViewProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
  colorScheme?: "light" | "dark";
  blurTarget?: RefObject<View | null>;
}>;

export function LiquidGlassView({
  children,
  style,
  tintColor,
  colorScheme,
  blurTarget,
}: LiquidGlassViewProps) {
  const flattenedStyle = StyleSheet.flatten(style);
  const borderRadius = flattenedStyle?.borderRadius;

  return (
    <View
      style={[
        style,
        {
          backgroundColor: tintColor,
          overflow: "hidden",
        },
      ]}
    >
      <BlurView
        key={blurTarget ? "blur" : "fallback"}
        blurMethod={blurTarget ? "dimezisBlurView" : "none"}
        blurReductionFactor={1}
        blurTarget={blurTarget}
        intensity={500}
        tint={colorScheme ?? "light"}
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
          },
        ]}
      />
      {children}
    </View>
  );
}
