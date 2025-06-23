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
  group?: string;
};

export default function OperationDetailScreen() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { settingKey } = useLocalSearchParams<{ settingKey: string }>();
  const marginBottom = useDynamicBottom();
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
      { value: 'de', label: 'Deutsch' },
      { value: 'en', label: 'English' },
    ],
    jumpToFederalState: [
      { value: '', label: t('common.none') },
      { value: 'burgenland', label: t('assets.federalStates.bl') },
      { value: 'lower-austria', label: t('assets.federalStates.la') },
      { value: 'styria', label: t('assets.federalStates.st') },
      { value: 'tyrol', label: t('assets.federalStates.ty') },
      { value: 'upper-austria', label: t('assets.federalStates.ua') },
    ],
    jumpToDistrict: [
      { value: '', label: t('common.none') },
      { value: 'eisenstadt', label: t('assets.districts.bl.eisenstadt'), group: 'burgenland' },
      { value: 'rust', label: t('assets.districts.bl.rust'), group: 'burgenland' },
      { value: 'eisenstadt-umgebung', label: t('assets.districts.bl.eisenstadt-umgebung'), group: 'burgenland' },
      { value: 'guessing', label: t('assets.districts.bl.guessing'), group: 'burgenland' },
      { value: 'jennersdorf', label: t('assets.districts.bl.jennersdorf'), group: 'burgenland' },
      { value: 'mattersburg', label: t('assets.districts.bl.mattersburg'), group: 'burgenland' },
      { value: 'neusiedl-am-see', label: t('assets.districts.bl.neusiedl-am-see'), group: 'burgenland' },
      { value: 'oberpullendorf', label: t('assets.districts.bl.oberpullendorf'), group: 'burgenland' },
      { value: 'oberwart', label: t('assets.districts.bl.oberwart'), group: 'burgenland' },

      { value: 'amstetten', label: t('assets.districts.la.amstetten'), group: 'lower-austria' },
      { value: 'baden', label: t('assets.districts.la.baden'), group: 'lower-austria' },
      { value: 'bruck-an-der-leitha', label: t('assets.districts.la.bruck-an-der-leitha'), group: 'lower-austria' },
      { value: 'gaenserndorf', label: t('assets.districts.la.gaenserndorf'), group: 'lower-austria' },
      { value: 'gmuend', label: t('assets.districts.la.gmuend'), group: 'lower-austria' },
      { value: 'hollabrunn', label: t('assets.districts.la.hollabrunn'), group: 'lower-austria' },
      { value: 'horn', label: t('assets.districts.la.horn'), group: 'lower-austria' },
      { value: 'krems-an-der-donau', label: t('assets.districts.la.krems-an-der-donau'), group: 'lower-austria' },
      { value: 'kloserneuburg', label: t('assets.districts.la.kloserneuburg'), group: 'lower-austria' },
      { value: 'lilienfeld', label: t('assets.districts.la.lilienfeld'), group: 'lower-austria' },
      { value: 'melk', label: t('assets.districts.la.melk'), group: 'lower-austria' },
      { value: 'mistelbach', label: t('assets.districts.la.mistelbach'), group: 'lower-austria' },
      { value: 'moedling', label: t('assets.districts.la.moedling'), group: 'lower-austria' },
      { value: 'neunkirchen', label: t('assets.districts.la.neunkirchen'), group: 'lower-austria' },
      { value: 'purkersdorf', label: t('assets.districts.la.purkersdorf'), group: 'lower-austria' },
      { value: 'scheibbs', label: t('assets.districts.la.scheibbs'), group: 'lower-austria' },
      { value: 'schwechat', label: t('assets.districts.la.schwechat'), group: 'lower-austria' },
      { value: 'st-poelten', label: t('assets.districts.la.st-poelten'), group: 'lower-austria' },
      { value: 'stockerau', label: t('assets.districts.la.stockerau'), group: 'lower-austria' },
      { value: 'tulln', label: t('assets.districts.la.tulln'), group: 'lower-austria' },
      { value: 'waidhofen-an-der-thaya', label: t('assets.districts.la.waidhofen-an-der-thaya'), group: 'lower-austria' },
      { value: 'wr-neustadt', label: t('assets.districts.la.wr-neustadt'), group: 'lower-austria' },
      { value: 'zwettl', label: t('assets.districts.la.zwettl'), group: 'lower-austria' },

      { value: 'braunau', label: t('assets.districts.ua.braunau'), group: 'upper-austria' },
      { value: 'eferding', label: t('assets.districts.ua.eferding'), group: 'upper-austria' },
      { value: 'freistadt', label: t('assets.districts.ua.freistadt'), group: 'upper-austria' },
      { value: 'gmunden', label: t('assets.districts.ua.gmunden'), group: 'upper-austria' },
      { value: 'grieskirchen', label: t('assets.districts.ua.grieskirchen'), group: 'upper-austria' },
      { value: 'kirchdorf', label: t('assets.districts.ua.kirchdorf'), group: 'upper-austria' },
      { value: 'linz', label: t('assets.districts.ua.linz'), group: 'upper-austria' },
      { value: 'linz-land', label: t('assets.districts.ua.linz-land'), group: 'upper-austria' },
      { value: 'perg', label: t('assets.districts.ua.perg'), group: 'upper-austria' },
      { value: 'ried', label: t('assets.districts.ua.ried'), group: 'upper-austria' },
      { value: 'rohrbach', label: t('assets.districts.ua.rohrbach'), group: 'upper-austria' },
      { value: 'schaerding', label: t('assets.districts.ua.schaerding'), group: 'upper-austria' },
      { value: 'steyr', label: t('assets.districts.ua.steyr'), group: 'upper-austria' },
      { value: 'steyr-land', label: t('assets.districts.ua.steyr-land'), group: 'upper-austria' },
      { value: 'urfahr-umgebung', label: t('assets.districts.ua.urfahr-umgebung'), group: 'upper-austria' },
      { value: 'voecklabruck', label: t('assets.districts.ua.voecklabruck'), group: 'upper-austria' },
      { value: 'wels', label: t('assets.districts.ua.wels'), group: 'upper-austria' },
      { value: 'wels-land', label: t('assets.districts.ua.wels-land'), group: 'upper-austria' }
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
          <View style={[styles.contentList, {
            marginBottom: marginBottom + 50,
          }]}>
            <View
              style={{
                backgroundColor: Colors[colorScheme ?? 'light'].backgroundForground,
                borderRadius: 10,
                paddingHorizontal: 10,
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
                    borderTopColor: Colors[colorScheme ?? 'light'].textSub,
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
    fontFamily: 'Montserrat',
  },
  contentList: {
    width: '100%',
    maxWidth: 1000,
    padding: 10,
    marginHorizontal: 'auto',
  },
});