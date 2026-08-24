import Firedepartment from "@/assets/icons/firedepartment.svg";
import { Tabs } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useEffect } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useDynamicBottom } from "@/hooks/useDynamicBottom";
import i18n from "@/i18n";
import { settingsLocalService } from "@/services/local/SettingLocalService";
import { SettingService } from "@/services/local/SettingService";
import { CommonActions } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const marginBottom = useDynamicBottom();
  const { t } = useTranslation();

  // init i18n
  useEffect(() => {
    // from storage
    const initLanguage = async () => {
      const language = SettingService.getByKey("language");
      if (language) {
        language.then((lang) => {
          if (lang) {
            i18n.changeLanguage(lang as string);
          } else {
            i18n.changeLanguage("de");
          }
        });
      } else {
        i18n.changeLanguage("de");
      }
    };

    initLanguage();

    settingsLocalService.subscribe(async () => {
      const value = await SettingService.getByKey("language");
      if (value) {
        i18n.changeLanguage(value as string);
      }
    });
  }, []);

  const isEmbedded =
    Platform.OS === "web" &&
    new URLSearchParams(window.location.search).get("embedded") === "true";

  if (Platform.OS === "ios") {
    return (
      <NativeTabs
        tintColor={Colors[theme].tint}
        iconColor={{
          default: Colors[theme].tabIconDefault,
          selected: Colors[theme].tabIconSelected,
        }}
        minimizeBehavior="onScrollDown"
        screenListeners={({ navigation, route }) => ({
          tabPress: () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: route.name }],
              }),
            );
          },
        })}
      >
        <NativeTabs.Trigger name="operation" disableAutomaticContentInsets>
          <NativeTabs.Trigger.Icon
            sf={{ default: "map", selected: "map.fill" }}
          />
          <NativeTabs.Trigger.Label>
            {t("operation.title")}
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="firedepartment" disableAutomaticContentInsets>
          <NativeTabs.Trigger.Icon
            xcasset={{
              default: "FiredepartmentTab",
              selected: "FiredepartmentTab",
            }}
            renderingMode="template"
          />
          <NativeTabs.Trigger.Label>
            {t("firedepartment.title")}
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings" disableAutomaticContentInsets>
          <NativeTabs.Trigger.Icon
            sf={{ default: "gearshape", selected: "gearshape.fill" }}
          />
          <NativeTabs.Trigger.Label>
            {t("settings.title")}
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="index" hidden />
      </NativeTabs>
    );
  }

  return (
    <Tabs
      screenListeners={({ navigation, route }) => ({
        tabPress: () => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: route.name }],
            }),
          );
        },
      })}
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            height: 50 + marginBottom,
          },
          web: {
            backdropFilter: "blur(1000px) brightness(0.2)",
            position: "absolute",
            height: 50 + marginBottom,
            backgroundColor: Colors[theme].backgroundForground,
            display: isEmbedded ? "none" : "flex",
          },
          default: {
            position: "absolute",
            height: 50 + marginBottom,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="operation"
        options={{
          title: t("operation.title"),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="map.fill" color={color} />
          ),
          // href: '/operation',
        }}
      />
      <Tabs.Screen
        name="firedepartment"
        options={{
          title: t("firedepartment.title"),
          headerShown: false,
          // tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
          tabBarIcon: ({ color }) => (
            <Firedepartment height={28} width={28} color={color} />
          ),
          // href: '/firedepartmnet',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings.title"),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gear" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="operation/[federalStateId]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="operation/[federalStateId]/[districtId]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="operation/details/[uuid]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings/[settingKey]"
        options={{ href: null }}
      /> */}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
