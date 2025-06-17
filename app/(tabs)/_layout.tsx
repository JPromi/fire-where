import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDynamicBottom } from '@/hooks/useDynamicBottom';
import { CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const marginBottom = useDynamicBottom();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            height: 50 + marginBottom,
          },
          web: {
            backdropFilter: 'blur(1000px) brightness(0.2)',
            position: 'absolute',
            height: 50 + marginBottom,
            backgroundColor: Colors[colorScheme ?? 'light'].backgroundForground,
          },
          default: {
            position: 'absolute',
            height: 50 + marginBottom
          },
        }),
      }}>
      <Tabs.Screen
        name="operation"
        options={{
          title: t('operation.title'),
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
          // href: '/operation',
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'operation' }],
              })
            );
          },
        })}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings.title'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
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
        name="index"
        options={{ href: null }}
      />
    </Tabs>
  );
}
