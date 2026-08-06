import { BlurView } from "expo-blur";
import { PropsWithChildren } from "react";
import { StyleProp, ViewStyle } from "react-native";

type LiquidGlassViewProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
  colorScheme?: "light" | "dark";
}>;

export function LiquidGlassView({
  children,
  style,
  colorScheme,
}: LiquidGlassViewProps) {
  return (
    <BlurView
      intensity={100}
      style={style}
      tint={colorScheme === "dark" ? "dark" : "light"}
    >
      {children}
    </BlurView>
  );
}
