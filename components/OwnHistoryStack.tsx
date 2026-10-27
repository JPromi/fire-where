import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { settingsLocalService } from "@/services/local/SettingLocalService";
import { SettingService } from "@/services/local/SettingService";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { IconSymbol } from "./ui/IconSymbol";

export function OwnHistoryStack() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isLaExtendedEnabled, setIsLaExtendedEnabled] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const updateSetting = async () => {
      const value = await SettingService.getByKey("laExtendedMode");
      if (active) setIsLaExtendedEnabled(value === true);
    };
    const unsubscribe = settingsLocalService.subscribe(updateSetting);
    updateSetting();
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);
  

    return (
      <Stack.Screen
        options={{
          headerRight: () =>
            isLaExtendedEnabled ? (
              <Pressable
                accessibilityLabel="Platzhalter"
                accessibilityRole="button"
                hitSlop={10}
                onPress={() => {
                  router.push({
                    pathname: "/operation/own",
                  });
                }}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 6,
                  marginHorizontal: Platform.OS === "ios" ? undefined : 14,
                  minHeight: 24,
                  width: 24,
                }}
              >
                <IconSymbol
                  name="clock"
                  size={22}
                  color={Colors[colorScheme ?? "light"].tint}
                />
              </Pressable>
            ) : null,
        }}
      />
    )
}
