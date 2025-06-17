import districtData from '@/assets/data/districts.json';
import federStatesData from '@/assets/data/federal-states.json';
import { ThemedView } from "@/components/ThemedView";
import { useDynamicBottom } from "@/hooks/useDynamicBottom";
import { FederalState } from '@/models/FederalState';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";

export default function OperationSelectDistrict() {
  const { t } = useTranslation();
  const { federalStateId, districtId } = useLocalSearchParams<{ federalStateId: string, districtId: string }>();
  const router = useRouter();
  const marginBottom = useDynamicBottom();

  var federalState: FederalState | null = null;
  const districts: { id: string, name: string }[] = [];
  var district: { id: string, name: string } = { id: districtId, name: "" };

  loadFederalState();

  function loadFederalState() {
    const data: FederalState[] = federStatesData.map((fs) => ({
      id: fs.id,
      idLong: fs.idLong,
      name: t(`assets.federalStates.${fs.id}`),
      disabled: fs.disabled || false,
    }));

    data.sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      return a.name.localeCompare(b.name);
    });

    federalState = data.find(fs => fs.idLong === federalStateId) || null;

    loadDistrictFromData();
  }

  function loadDistrictFromData() {
    if (federalState) {
      const data = districtData.find(d => d.fdId === federalState?.id);
      if(data) {
        data.districts.forEach(d => {
          districts.push({
            id: d.id,
            name: t(`assets.districts.${federalState?.id}.${d.id}`),
          });
        });

        districts.sort((a, b) => a.name.localeCompare(b.name));

        district = districts.find(d => d.id === districtId) || { id: districtId, name: "" };
      }
    }
  }

  return (
    <>
      <Stack.Screen options={{
          title: district.name,
          }} />
        <ThemedView style={[styles.container, { paddingBottom: marginBottom + 50 }]}>
          <ScrollView></ScrollView>
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
