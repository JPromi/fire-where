import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { SettingService } from "@/services/local/SettingService";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Switch, useColorScheme, View } from "react-native";


type SettingsItem = {
  key: string;
  name: string;
  type: 'extra' | 'switch';
  valueSwitch?: boolean;
  valueExtra?: string;
}

type SettingsGroup = {
  groupName: string;
  items: SettingsItem[];
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const router = useRouter();
  /*
  ToDo:
  - Change language
  - Activate nerd mode (display operation ids, uuids, system informations,...)
  - Activate jump to district / federal state
  */

  const [settings, setSettings] = useState<SettingsGroup[]>([
    {
      groupName: t('settings.group.general.title'),
      items: [
        {
          key: 'language',
          name: t('settings.group.general.language'),
          type: 'extra',
          valueExtra: 'Deutsch',
        },
        {
          key: 'nerdMode',
          name: t('settings.group.general.nerdMode'),
          type: 'switch',
          valueSwitch: false,
        },
      ],
    },
  ]);
  
  useEffect(() => {
    loadSettings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
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

    setSettings(updatedSettings);
  };

  function updateSetting(settingKey: string, selectedData: string | boolean | null) {
    SettingService.setByKey(settingKey, selectedData);
    const updatedSettings = settings.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.key === settingKey ? { ...item, valueSwitch: selectedData as boolean, valueExtra: selectedData as string } : item
      ),
    }));
    setSettings(updatedSettings);
  }


  return (
    <>
      <Stack.Screen options={{ title: t('settings.title') }} />
      <ThemedView style={styles.container}>
        <ScrollView>
          <View style={styles.contentList}>
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
                              }}>{item.valueExtra}</ThemedText>
                            </Pressable>
                          )}
                        </View>
                      ))}
                  </View>

              </View>
            ))}
          </View>
        </ScrollView>
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