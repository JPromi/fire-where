import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useDynamicBottom } from "@/hooks/useDynamicBottom";
import { settingsLocalService } from "@/services/local/SettingLocalService";
import { SettingService } from "@/services/local/SettingService";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, useColorScheme, View } from "react-native";


type SettingsItem = {
  key: string;
  name: string;
  type: 'extra' | 'switch';
  valueSwitch?: boolean;
  valueExtra?: string;
  showIfKeyIsset?: string;
  valueTranslationKey?: string;
}

type SettingsGroup = {
  groupName: string;
  items: SettingsItem[];
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const router = useRouter();
  const marginBottom = useDynamicBottom();
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<SettingsGroup[]>([
    {
      groupName: t('settings.group.general.title'),
      items: [
        {
          key: 'language',
          name: t('settings.group.general.language'),
          type: 'extra',
          valueExtra: 'Deutsch',
          valueTranslationKey: 'assets.language',
        },
        {
          key: 'nerdMode',
          name: t('settings.group.general.nerdMode'),
          type: 'switch',
          valueSwitch: false,
        },
      ],
    },
    {
      groupName: "Einsätze",
      items: [
        {
          key: 'jumpToFederalState',
          name: 'In Bundesland springen',
          type: 'extra',
          valueExtra: '',
          valueTranslationKey: 'assets.federalStates',
        },
        {
          key: 'jumpToDistrict',
          name: 'In Bezirk springen',
          type: 'extra',
          valueExtra: '',
          showIfKeyIsset: 'jumpToFederalState',
          valueTranslationKey: '',
        }
      ]
    }
  ]);
  
  useEffect(() => {
    loadSettings();

    const unsubscribe = settingsLocalService.subscribe(() => {
      const updatedSettings = [...settings];
      for (const group of updatedSettings) {
        for (const item of group.items) {
          const value = settingsLocalService.get(item.key);
          if (value !== undefined) {
            if (item.type === 'switch') {
              item.valueSwitch = value as boolean;
            } else if (item.type === 'extra') {
              item.valueExtra = value as string;
            }
          }
        }
      }
      setRuntimeSettings();
      setSettings(updatedSettings);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const updatedSettings = [...settings];

    for (const group of updatedSettings) {
      for (const item of group.items) {
        const value = await SettingService.getByKey(item.key);
        if (value !== undefined) {
          if (item.type === 'switch') {
            item.valueSwitch = value as boolean;
          } else if (item.type === 'extra') {
            item.valueExtra = value as string;
          }
        }
      }
    }

    setRuntimeSettings();
    setLoading(false);

    setSettings(updatedSettings);
  };

  function setRuntimeSettings() {
    // set valueTranslationkey for jumpToDistrict
    const jumpToDistrictItem = settings.flatMap(group => group.items).find(item => item.key === 'jumpToDistrict');
    if (jumpToDistrictItem) {
      const jumpToFederalStateItem = settings.flatMap(group => group.items).find(item => item.key === 'jumpToFederalState');
      if (jumpToFederalStateItem && jumpToFederalStateItem.valueExtra) {
        jumpToDistrictItem.valueTranslationKey = `assets.districts.${jumpToFederalStateItem.valueExtra}`;
      } else {
        jumpToDistrictItem.valueTranslationKey = '';
      }
    }

  }

  function updateSetting(settingKey: string, selectedData: string | boolean | null) {
    SettingService.setByKey(settingKey, selectedData);
    const updatedSettings = settings.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.key === settingKey ? { ...item, valueSwitch: selectedData as boolean, valueExtra: selectedData as string } : item
      ),
    }));
    setTimeout(() => {
      settingsLocalService.set(settingKey, selectedData);
    }, 0);
  }

  function isItemDisabled(item: SettingsItem): boolean {
    if (item.showIfKeyIsset) {
      const relatedItem = settings.flatMap(group => group.items).find(i => i.key === item.showIfKeyIsset);
      if (relatedItem && (relatedItem.valueExtra || relatedItem.valueSwitch)) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: t('settings.title') }} />
      <ThemedView style={styles.container}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: marginBottom + 50 }}>
            <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          </View>
        ) : (
          <ScrollView>
            <View style={[styles.contentList, { marginBottom: marginBottom + 50 }]}>
              {settings.map((group, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 20,
                    padding: 10
                  }}>

                    <ThemedText style={{
                      fontSize: 15,
                      fontWeight: 'light',
                      marginBottom: 5,
                      marginLeft: 15,
                      color: Colors[colorScheme ?? 'light'].text,
                      opacity: 0.5
                    }}>{group.groupName}</ThemedText>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: Colors[colorScheme ?? 'light'].backgroundForground,
                        paddingHorizontal: 15,
                        borderRadius: 10,
                      }}>
                        {group.items.map((item, itemIndex) => (
                          <View
                            key={itemIndex}
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              height: 48,
                              borderBottomWidth: index === 0 && itemIndex === 0 ? 1 : 0,
                              borderBottomColor: Colors[colorScheme ?? 'light'].textSub,
                            }}>
                            <ThemedText style={{
                              fontSize: 16,
                              color: Colors[colorScheme ?? 'light'].text,
                              opacity: isItemDisabled(item) ? 0.5 : 1,
                            }}>{item.name}</ThemedText>
                            {item.type === 'switch' && (
                              <Switch
                                value={item.valueSwitch}
                                onValueChange={(value) => {
                                  updateSetting(item.key, value);
                                }}
                              />
                            )}
                            {item.type === 'extra' && (
                              <Pressable onPress={() => {
                                if(isItemDisabled(item)) {
                                  return;
                                }

                                router.push(
                                  {
                                    pathname: `/settings/[settingKey]`,
                                    params: {
                                      settingKey: item.key,
                                    },
                                  }
                                );
                              }}>
                                <ThemedText style={{
                                  fontSize: 16,
                                  color: Colors[colorScheme ?? 'light'].textSub,
                                }}>{item.valueExtra || item.valueExtra != '' ? (item.valueTranslationKey ? t(`${item.valueTranslationKey}.${item.valueExtra}`) : item.valueExtra) : t('common.none')}</ThemedText>
                              </Pressable>
                            )}
                          </View>
                        ))}
                    </View>

                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Montserrat',
  },
  contentList: {
    width: '100%',
    maxWidth: 1000,
    marginHorizontal: 'auto',
  },
});