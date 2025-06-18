import districtData from "@/assets/data/districts.json";
import federStatesData from "@/assets/data/federal-states.json";
import IconAtMap from "@/assets/icons/map-at.svg";
import { SvgAtFederalStateMap } from "@/components/assets/SvgAtFederalStateMap";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useDynamicBottom } from "@/hooks/useDynamicBottom";
import { FederalState } from "@/models/FederalState";
import { BlurView } from "expo-blur";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, ScrollView, StyleSheet, useColorScheme, View } from "react-native";

export default function OperationSelectDistrict() {
  const { t } = useTranslation();
  const { federalStateId } = useLocalSearchParams<{ federalStateId: string }>();
  const colorScheme = useColorScheme();
  const marginBottom = useDynamicBottom();
  const router = useRouter();
  const blurSupported = Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version >= 31);


  const [isMapView, setIsMapView] = useState(true);

  const federalStates: FederalState[] = [];
  var federalState: FederalState | null = federalStates.find(fs => fs.idLong === federalStateId) || null;
  const districts: { id: string, name: string }[] = [];

  loadFederalStatesFromData();

  function loadFederalStatesFromData() {
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

    loadDistrictsFromData();
  }

  function loadDistrictsFromData() {
    if (federalState) {
      const data = districtData.find(d => d.fdId === federalState?.id);
      if(data) {
        data.districts.forEach(d => {
          districts.push({
            id: d,
            name: t(`assets.districts.${federalState?.id}.${d}`),
          });
        });

        districts.sort((a, b) => a.name.localeCompare(b.name));
      }
    }
  }

  function setView(isMap: boolean) {
    setIsMapView(isMap);
  }

  function handlePress(disctrictId: string) {
    if (disctrictId) {
      router.push({
        pathname: "/operation/[federalStateId]/[districtId]",
        params: { federalStateId: federalStateId, districtId: disctrictId },
      });
    }
  }

  return (
    <>
      <Stack.Screen options={{
        title: federalState?.name,
        }} />
      <ThemedView style={[styles.container, { paddingBottom: marginBottom + 50 }]}>
        {isMapView ? (
          <SvgAtFederalStateMap federalState={federalState?.id} onSelect={(district) => handlePress(district)}/>
        ) : (
          <ScrollView>
            <View style={[styles.contentList, { marginBottom: marginBottom + 50 }]}>
              {districts.map((fs) => (
                <Pressable
                  key={fs.id}
                  // onPress={() => selectFederalState(fs.id)}
                  style={({ pressed }) => ({
                    padding: 12,
                    borderBottomWidth: 1,
                    borderColor: Colors[colorScheme ?? 'light'].border,
                    opacity: pressed ? 0.7 : 1,
                    // cursor: fs.disabled ? 'not-allowed' : 'pointer',
                  })}
                  onPress={() => handlePress(fs.id)}
                >
                  <ThemedText style={{ color: Colors[colorScheme ?? 'light'].text }}>
                    {fs.name}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}

        <View
          style={
            [
              {
                marginBottom: marginBottom + 50,
                position: 'absolute',
                bottom: 20,
                right: 20,
                zIndex: 2,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: blurSupported ? '' : Colors[colorScheme ?? 'light'].backgroundForground,
                backdropFilter: blurSupported ? 'blur(10px) brightness(0.2)' : '',
              }
            ]
          }
        >
          <BlurView
            style={
              [
                styles.buttonContainer,
                {
                  backgroundColor: Colors[colorScheme ?? 'light'].tint + '15',
                }
              ]
              }
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
            >
            <Pressable style={styles.button} onPress={() => {setView(true)}}>
              <IconAtMap style={[styles.buttonIcon, { filter: colorScheme === 'dark' ? '' : 'invert(1)' }]}/>
            </Pressable>
            <Pressable style={styles.button} onPress={() => {setView(false)}}>
            </Pressable>
          </BlurView>
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
    display: 'flex',
    flexDirection: 'row',
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
