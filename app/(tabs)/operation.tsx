import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SvgAtMap } from '@/components/assets/SvgAtMap';
import { Colors } from '@/constants/Colors';
import { FederalState } from '@/models/FederalState';
import { useState } from 'react';
import IconAtMap from '../../assets/icons/map-at.svg';

import federStatesData from '@/assets/data/federal-states.json';
import { useTranslation } from 'react-i18next';

export default function OperationSelectFederalStateScreen() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const router = useRouter();

  const [isMapView, setIsMapView] = useState(true);

  const federalStates: FederalState[] = [];

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

    federalStates.push(...data);
  }

  function setView(isMap: boolean) {
    setIsMapView(isMap);
  }

  function getActiveFederalStates(): string[] {
    return federalStates
      .filter(fs => !fs.disabled)
      .map(fs => fs.id);
  }

  function selectFederalState(fdId: string) {
    const found = federalStates.find(fs => fs.id === fdId);
    const longId = found ? found.idLong : null;
    if (longId && !found?.disabled) {
      router.push({
        pathname: "/operation/[federalStateId]",
        params: { federalStateId: longId }
      });
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Einsätze' }} />
      <ThemedView style={styles.container}>
        { isMapView ? ( 
          <View style={styles.contentMap}>
            <SvgAtMap activeFs={getActiveFederalStates()} onSelect={(fsId) => selectFederalState(fsId)}/>
          </View>
        ) : (
          <View style={styles.contentList}>
            {federalStates.map((fs) => (
              <Pressable
                key={fs.id}
                onPress={() => selectFederalState(fs.id)}
                disabled={fs.disabled}
                style={({ pressed }) => ({
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: Colors[colorScheme ?? 'light'].border,
                  opacity: fs.disabled ? 0.25 : pressed ? 0.7 : 1,
                  cursor: fs.disabled ? 'not-allowed' : 'pointer',
                })}
              >
                <ThemedText style={{ color: Colors[colorScheme ?? 'light'].text }}>
                  {fs.name}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        )}

        <View
          style={
            [
              styles.buttonContainer,
              {
                backgroundColor: colorScheme === 'dark' ? '#ffffff10' : '#00000010',
                borderColor: colorScheme === 'dark' ? '#ffffff20' : '#00000020',
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
  );
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
    paddingHorizontal: 20,
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
