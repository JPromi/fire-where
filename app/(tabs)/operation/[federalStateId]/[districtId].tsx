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
  }

  return (
    <>
      <Stack.Screen options={{
          title: districtId,
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
