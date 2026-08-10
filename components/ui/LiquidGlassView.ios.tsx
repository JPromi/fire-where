import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { PropsWithChildren, RefObject } from "react";
import { StyleProp, ViewStyle } from "react-native";
import type { View } from "react-native";

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
}: LiquidGlassViewProps) {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        colorScheme={colorScheme ?? "light"}
        glassEffectStyle="regular"
        isInteractive
        style={style}
        tintColor={tintColor}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <BlurView intensity={100} style={style} tint={colorScheme ?? "light"}>
      {children}
    </BlurView>
  );
}
