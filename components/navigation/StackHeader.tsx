import { Header, getHeaderTitle } from "expo-router/build/react-navigation/elements";
import type { NativeStackHeaderProps } from "expo-router";
import type React from "react";
import { Platform } from "react-native";

export function StackHeader({ back, options, route }: NativeStackHeaderProps) {
  return (
    <Header
      {...(options as React.ComponentProps<typeof Header>)}
      back={back as React.ComponentProps<typeof Header>["back"]}
      headerStatusBarHeight={Platform.OS === "android" ? 0 : undefined}
      title={getHeaderTitle(options, route.name)}
    />
  );
}
