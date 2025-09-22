import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { SettingService } from "@/services/local/SettingService";
import { Stack, useLocalSearchParams, useNavigationContainerRef, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from "react-native";

type DataSet = {
  value: string;
  label: string;
  group?: string;
};

export default function OperationDetailScreen() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { settingKey } = useLocalSearchParams<{ settingKey: string }>();
  const dynamicSide = useDynamicSide();
  const router = useRouter();
  const navRef = useNavigationContainerRef();

  const [ selectedData, setSelectedData ] = useState<string | boolean | null | undefined>(null);
  const [ dataSet, setDataSet ] = useState<DataSet[]>([]);

  const knownKeys = [
    'language',
    'jumpToFederalState',
    'jumpToDistrict',
  ];

  const hasGroup: { [key: string]: string } = {
    'jumpToDistrict': 'jumpToFederalState',
  }

  const data: Record<string, DataSet[]> = {
    language: [
      { value: 'de', label: t('assets.language.de') },
      { value: 'en', label: t('assets.language.en') },
    ],
    jumpToFederalState: [
      { value: '', label: t('common.none') },
      { value: 'bl', label: t('assets.federalStates.bl') },
      { value: 'la', label: t('assets.federalStates.la') },
      { value: 'st', label: t('assets.federalStates.st') },
      { value: 'ty', label: t('assets.federalStates.ty') },
      { value: 'ua', label: t('assets.federalStates.ua') },
    ],
    jumpToDistrict: [
      { value: '', label: t('common.none') },
      { value: 'eisenstadt', label: t('assets.districts.bl.eisenstadt'), group: 'bl' },
      { value: 'rust', label: t('assets.districts.bl.rust'), group: 'bl' },
      { value: 'eisenstadt-umgebung', label: t('assets.districts.bl.eisenstadt-umgebung'), group: 'bl' },
      { value: 'guessing', label: t('assets.districts.bl.guessing'), group: 'bl' },
      { value: 'jennersdorf', label: t('assets.districts.bl.jennersdorf'), group: 'bl' },
      { value: 'mattersburg', label: t('assets.districts.bl.mattersburg'), group: 'bl' },
      { value: 'neusiedl-am-see', label: t('assets.districts.bl.neusiedl-am-see'), group: 'bl' },
      { value: 'oberpullendorf', label: t('assets.districts.bl.oberpullendorf'), group: 'bl' },
      { value: 'oberwart', label: t('assets.districts.bl.oberwart'), group: 'bl' },

      { value: 'amstetten', label: t('assets.districts.la.amstetten'), group: 'la' },
      { value: 'baden', label: t('assets.districts.la.baden'), group: 'la' },
      { value: 'bruck-an-der-leitha', label: t('assets.districts.la.bruck-an-der-leitha'), group: 'la' },
      { value: 'gaenserndorf', label: t('assets.districts.la.gaenserndorf'), group: 'la' },
      { value: 'gmuend', label: t('assets.districts.la.gmuend'), group: 'la' },
      { value: 'hollabrunn', label: t('assets.districts.la.hollabrunn'), group: 'la' },
      { value: 'horn', label: t('assets.districts.la.horn'), group: 'la' },
      { value: 'krems-an-der-donau', label: t('assets.districts.la.krems-an-der-donau'), group: 'la' },
      { value: 'kloserneuburg', label: t('assets.districts.la.kloserneuburg'), group: 'la' },
      { value: 'lilienfeld', label: t('assets.districts.la.lilienfeld'), group: 'la' },
      { value: 'melk', label: t('assets.districts.la.melk'), group: 'la' },
      { value: 'mistelbach', label: t('assets.districts.la.mistelbach'), group: 'la' },
      { value: 'moedling', label: t('assets.districts.la.moedling'), group: 'la' },
      { value: 'neunkirchen', label: t('assets.districts.la.neunkirchen'), group: 'la' },
      { value: 'purkersdorf', label: t('assets.districts.la.purkersdorf'), group: 'la' },
      { value: 'scheibbs', label: t('assets.districts.la.scheibbs'), group: 'la' },
      { value: 'schwechat', label: t('assets.districts.la.schwechat'), group: 'la' },
      { value: 'st-poelten', label: t('assets.districts.la.st-poelten'), group: 'la' },
      { value: 'stockerau', label: t('assets.districts.la.stockerau'), group: 'la' },
      { value: 'tulln', label: t('assets.districts.la.tulln'), group: 'la' },
      { value: 'waidhofen-an-der-thaya', label: t('assets.districts.la.waidhofen-an-der-thaya'), group: 'la' },
      { value: 'wr-neustadt', label: t('assets.districts.la.wr-neustadt'), group: 'la' },
      { value: 'zwettl', label: t('assets.districts.la.zwettl'), group: 'la' },

      { value: 'braunau', label: t('assets.districts.ua.braunau'), group: 'ua' },
      { value: 'eferding', label: t('assets.districts.ua.eferding'), group: 'ua' },
      { value: 'freistadt', label: t('assets.districts.ua.freistadt'), group: 'ua' },
      { value: 'gmunden', label: t('assets.districts.ua.gmunden'), group: 'ua' },
      { value: 'grieskirchen', label: t('assets.districts.ua.grieskirchen'), group: 'ua' },
      { value: 'kirchdorf', label: t('assets.districts.ua.kirchdorf'), group: 'ua' },
      { value: 'linz', label: t('assets.districts.ua.linz'), group: 'ua' },
      { value: 'linz-land', label: t('assets.districts.ua.linz-land'), group: 'ua' },
      { value: 'perg', label: t('assets.districts.ua.perg'), group: 'ua' },
      { value: 'ried', label: t('assets.districts.ua.ried'), group: 'ua' },
      { value: 'rohrbach', label: t('assets.districts.ua.rohrbach'), group: 'ua' },
      { value: 'schaerding', label: t('assets.districts.ua.schaerding'), group: 'ua' },
      { value: 'steyr', label: t('assets.districts.ua.steyr'), group: 'ua' },
      { value: 'steyr-land', label: t('assets.districts.ua.steyr-land'), group: 'ua' },
      { value: 'urfahr-umgebung', label: t('assets.districts.ua.urfahr-umgebung'), group: 'ua' },
      { value: 'voecklabruck', label: t('assets.districts.ua.voecklabruck'), group: 'ua' },
      { value: 'wels', label: t('assets.districts.ua.wels'), group: 'ua' },
      { value: 'wels-land', label: t('assets.districts.ua.wels-land'), group: 'ua' }
    ],
  }
  useEffect(() => {
    let isMounted = true;
    const fetchSetting = async () => {
      if (!settingKey || !knownKeys.includes(settingKey)) {
        router.replace('/settings');
      } else {
        const storageValue = await SettingService.getByKey(`${settingKey}`);
        if (isMounted) {
          if (storageValue === undefined || storageValue === null) {
            setSelectedData('');
          } else {
            setSelectedData(storageValue);
          }
        }
        const ds = await getDataSet(settingKey);
        if (isMounted) {
          setDataSet(ds);
        }
      }
    };
    fetchSetting();
    return () => {
      isMounted = false;
    };
  }, [settingKey]);

  function updateSetting(settingKey: string, selectedData: string | boolean | null) {
    var toResetKey: string | undefined = undefined;
    for (const [key, value] of Object.entries(hasGroup)) {
      if (value === settingKey) {
        toResetKey = key;
        break;
      }
    }

    // reset dependent setting if exists
    if (toResetKey) {
      SettingService.setByKey(toResetKey, '');
    }

    SettingService.setByKey(settingKey, selectedData);
    setSelectedData(selectedData);
    
    if (navRef.isReady()) {
      navRef.goBack();
    } else {
      router.back();
    }
  }

  async function getDataSet(settingKey: string): Promise<DataSet[]> {
    const allItems = data[settingKey] || [];

    if (hasGroup[settingKey]) {
      const groupFilterKey = hasGroup[settingKey];
      const groupFilter = await SettingService.getByKey(groupFilterKey);

      if (typeof groupFilter === 'string') {
        return allItems.filter((item) => item.group === groupFilter || item.group === undefined )
                      .map((item) => ({ ...item, group: '' }));
      } else {
        return [];
      }
    }

    return allItems.map((item) => ({ ...item, group: '' }));
  }

  return (
    <>
      <Stack.Screen options={{ title: t(`settings.extended.${settingKey}.title`) }} />
      <ThemedView style={styles.container}>
        <ScrollView>
          <View style={[styles.contentList, { paddingBottom: dynamicSide.bottom + 50 + 10, paddingLeft: dynamicSide.left + 10, paddingRight: dynamicSide.right + 10 }]}>
            <View
              style={{
                backgroundColor: Colors[colorScheme ?? 'light'].backgroundForground,
                borderRadius: 10,
                paddingHorizontal: 15,
              }}>
              {dataSet.map((item, index) => (
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
                    borderTopWidth: index === 0 && index === 0 ? 0 : 1,
                    borderTopColor: Colors[colorScheme ?? 'light'].backgroundForgroundBorder,
                  }}>
                  <ThemedText>{item.label}</ThemedText>
                  { selectedData == item.value &&
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
  },
  contentList: {
    width: '100%',
    maxWidth: 1000,
    padding: 10,
    marginHorizontal: 'auto',
  },
});