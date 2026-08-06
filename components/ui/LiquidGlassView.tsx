import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

type LiquidGlassViewProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
  colorScheme?: "light" | "dark";
}>;

export function LiquidGlassView({
  children,
  style,
  tintColor,
}: LiquidGlassViewProps) {
  return (
    <View
      style={[
        {
          backdropFilter: "blur(10px)",
          backgroundColor: tintColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
