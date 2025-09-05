import Firedepartment from '@/assets/icons/firedepartment.svg';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDynamicBottom } from '@/hooks/useDynamicBottom';
import i18n from '@/i18n';
import { settingsLocalService } from '@/services/local/SettingLocalService';
import { SettingService } from '@/services/local/SettingService';
import { CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const marginBottom = useDynamicBottom();
  const { t } = useTranslation();

  // init i18n
  useEffect(() => {
    // from storage
    const initLanguage = async () => {
      const language = SettingService.getByKey('language');
      if (language) {
        language.then((lang) => {
          if (lang) {
            i18n.changeLanguage(lang as string);
          } else {
            i18n.changeLanguage('de');
          }
        });
      } else {
        i18n.changeLanguage('de');
      }
    };

    initLanguage();

    settingsLocalService.subscribe(async () => {
      const value = await SettingService.getByKey('language');
      if (value) {
        i18n.changeLanguage(value as string);
      }
    });
  }, []);

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
          animation: 'fade'
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
        name="firedepartment"
        options={{
          title: t('firedepartment.title'),
          headerShown: false,
          // tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
          tabBarIcon: ({ color }) => <Firedepartment height={28} width={28} color={color}/>,
          // href: '/firedepartmnet',
          animation: 'fade'
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'firedepartment' }],
              })
            );
          },
        })}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings.title'),
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
          animation: 'fade',
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'settings' }],
              })
            );
          },
        })}
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
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />
    </Tabs>
  );
}
