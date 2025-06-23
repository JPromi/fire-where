import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useDynamicBottom } from "@/hooks/useDynamicBottom";
import { SettingService } from "@/services/local/SettingService";
import { Stack, useLocalSearchParams, useNavigationContainerRef, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from "react-native";

type DataSet = {
  value: string;
  label: string;
};

export default function OperationDetailScreen() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { settingKey } = useLocalSearchParams<{ settingKey: string }>();
  const marginBottom = useDynamicBottom();
  const router = useRouter();
  const navRef = useNavigationContainerRef();

  const [ selectedData, setSelectedData ] = useState<string | boolean | null | undefined>(null);

  const knownKeys = [
    'language'
  ];

  const data: Record<string, DataSet[]> = {
    language: [
      { value: 'de', label: 'Deutsch' },
      { value: 'en', label: 'English' },
    ]
  }

  useEffect(() => {
    let isMounted = true;
    const fetchSetting = async () => {
      if (!settingKey || !knownKeys.includes(settingKey)) {
        router.replace('/settings');
      } else {
        const storageValue = await SettingService.getByKey(`${settingKey}`);
        if (isMounted) {
          if (storageValue !== undefined && storageValue !== null) {
            setSelectedData(storageValue);
          } else {
            setSelectedData(data[settingKey]?.[0]?.value || null);
          }
        }
      }
    };
    fetchSetting();
    return () => {
      isMounted = false;
    };
  }, [settingKey]);

  function updateSetting(settingKey: string, selectedData: string | boolean | null) {
    SettingService.setByKey(settingKey, selectedData);
    setSelectedData(selectedData);
  }

  return (
    <>
      <Stack.Screen options={{ title: t(`settings.extended.${settingKey}.title`) }} />
      <ThemedView style={styles.container}>
        <ScrollView>
          <View style={[styles.contentList, {
            marginBottom: marginBottom,
          }]}>
            <View
              style={{
                backgroundColor: Colors[colorScheme ?? 'light'].backgroundForground,
                display: 'flex',
                flexDirection: 'column',
                paddingHorizontal: 15,
                borderRadius: 10,
              }}>
              {data[settingKey]?.map((item, index) => (
                <Pressable
                  key={item.value}
                  onPress={() => {
                    updateSetting(settingKey, item.value);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 48,
                    borderBottomWidth: index === 0 && index === 0 ? 1 : 0,
                    borderBottomColor: Colors[colorScheme ?? 'light'].textSub,
                  }}>
                  <ThemedText>{item.label}</ThemedText>
                  { selectedData === item.value &&
                    <IconSymbol name="checkmark" size={18} color={Colors[colorScheme ?? 'light'].text} />
                  }
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Montserrat',
  },
  contentList: {
    width: '100%',
    maxWidth: 1000,
    padding: 10,
    marginHorizontal: 'auto',
  },
});