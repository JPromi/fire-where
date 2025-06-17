import federStatesData from "@/assets/data/federal-states.json";
import IconAtMap from "@/assets/icons/map-at.svg";
import { SvgAtFederalStateMap } from "@/components/assets/SvgAtFederalStateMap";
import { ThemedView } from "@/components/ThemedView";
import { FederalState } from "@/models/FederalState";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OperationSelectDistrict() {
  const { t } = useTranslation();
  const { federalStateId } = useLocalSearchParams<{ federalStateId: string }>();
  const colorScheme = useColorScheme();


  const [isMapView, setIsMapView] = useState(true);

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

  function setView(isMap: boolean) {
    setIsMapView(isMap);
  }

  return (
    <>
      <Stack.Screen options={{
        title: federalState?.name,
        headerBackTitle: t('common.back'),
        }} />
      <ThemedView style={styles.container}>
        {isMapView ? (
          <SvgAtFederalStateMap federalState={federalState?.id}/>
        ) : (null)}

        <View
          style={
            [
              styles.buttonContainer,
              {
                backgroundColor: colorScheme === 'dark' ? '#ffffff10' : '#00000010',
                borderColor: colorScheme === 'dark' ? '#ffffff20' : '#00000020',
                marginBottom: useSafeAreaInsets().bottom + 20 + 30,
              }
            ]
          }
          >
          <Pressable style={styles.button} onPress={() => {setView(true)}}>
            <IconAtMap style={[styles.buttonIcon, { filter: colorScheme === 'dark' ? '' : 'invert(1)' }]}/>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {setView(false)}}>
          </Pressable>
        </View>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Montserrat',
  },
  contentMap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentList: {
    width: '100%',
    maxWidth: 1000,
    marginHorizontal: 'auto',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'row',
    zIndex: 2,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
  },
  button: {
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    fontSize: 12,
    opacity: .32,
  },
  buttonIcon: {
    width: "100%",
    height: "100%",
    maxHeight: 24,
    maxWidth: 36,
    marginBottom: 2,
  }
});
