import { Header, getHeaderTitle } from "expo-router/build/react-navigation/elements";
import type { NativeStackHeaderProps } from "expo-router";
import type React from "react";
import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function StackHeader({ back, options, route }: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  return (
    <Header
      key={Platform.OS === "android" ? `${width}x${height}-${insets.top}` : route.key}
      {...(options as React.ComponentProps<typeof Header>)}
      back={back as React.ComponentProps<typeof Header>["back"]}
      headerStatusBarHeight={Platform.OS === "android" ? insets.top : undefined}
      title={getHeaderTitle(options, route.name)}
    />
  );
}
