import federStatesData from "@/assets/data/federal-states.json";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FederalState } from "@/models/FederalState";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function OperationSelectDistrict() {
  const { t } = useTranslation();
  const { federalStateId } = useLocalSearchParams<{ federalStateId: string }>();

  const federalStates: FederalState[] = [];
  var federalState: FederalState | null = federalStates.find(fs => fs.idLong === federalStateId) || null;

  setFederalStatesFromData();

  function setFederalStatesFromData() {
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

    federalStates.push(...data);
  }

  return (
    <>
      <Stack.Screen options={{ title: federalState?.name }} />
      <ThemedView style={styles.container}>
        <ThemedText>{federalState?.name}</ThemedText>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Montserrat',
  },
});