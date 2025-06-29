import { Stack, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import IconAtMap from '@/assets/icons/map-at.svg';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SvgAtMap } from '@/components/assets/SvgAtMap';
import { Colors } from '@/constants/Colors';
import { FederalState } from '@/models/FederalState';
import { useEffect, useState } from 'react';

import federStatesData from '@/assets/data/federal-states.json';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useDynamicBottom } from '@/hooks/useDynamicBottom';
import { LocationStatistic } from '@/models/LocationStatistic';
import { OperationService } from '@/services/OperationService';
import { ServiceService } from '@/services/ServiceService';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

export default function OperationSelectFederalStateScreen() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const router = useRouter();
  const marginBottom = useDynamicBottom();
  const blurSupported = Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version >= 31);

  const [isMapView, setIsMapView] = useState(true);
  const [statistic, setStatistic] = useState<LocationStatistic[]>([]);

  const federalStates: FederalState[] = [];

  useEffect(() => {
    getStatistic();
  }, []);

  setFederalStatesFromData();

  function setFederalStatesFromData() {
    const data: FederalState[] = federStatesData.map((fs) => ({
      id: fs.id,
      idLong: fs.idLong,
      name: t(`assets.federalStates.${fs.id}`),
      disabled: false,
    }));

    ServiceService.getServices().then((services) => {
      data.forEach((fs) => {
        const service = services.find(s => s.serviceName === `fs-${fs.id}`);
        if (service && !service.isEnabled) {
          fs.disabled = true;
        }
      });
    })

    data.sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      return a.name.localeCompare(b.name);
    });

    console.log('Federal States:', data);

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

  function getStatistic() {
    OperationService.getStatistic()
      .then((data) => {
        setStatistic(data);
      });
  }

  function getActiveOperations(fsId: string): number {
    const fsStatistic = statistic.find(stat => stat.nameId === fsId);
    return fsStatistic ? fsStatistic.countActive : 0;
  }

  return (
    <>
      <Stack.Screen options={{ title: t('operation.title') }} />
      <ThemedView style={styles.container}>
        { isMapView ? ( 
          <View style={[styles.contentMap, {marginBottom: marginBottom + 50}]}>
            <SvgAtMap activeFs={getActiveFederalStates()} onSelect={(fsId) => selectFederalState(fsId)} statistic={statistic}/>
          </View>
        ) : (
          <ScrollView>
            <View style={[styles.contentList, { marginBottom: marginBottom + 50 }]}>
              {federalStates.map((fs) => (
                <Pressable
                  key={fs.id}
                  onPress={() => selectFederalState(fs.id)}
                  disabled={fs.disabled}
                  style={({ pressed }) => ({
                    padding: 12,
                    borderBottomWidth: 1,
                    borderColor: Colors[colorScheme ?? 'light'].border,
                    opacity: fs.disabled ? 0.25 : pressed ? 0.7 : 1,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // cursor: fs.disabled ? 'not-allowed' : 'pointer',
                  })}
                >
                  <ThemedText style={{ color: Colors[colorScheme ?? 'light'].text }}>
                    {fs.name}
                  </ThemedText>

                  { getActiveOperations(fs.id ??'') > 0 && (
                    <Text style={{
                      color: Colors[colorScheme ?? 'light'].opSupportText,
                      fontSize: 16,
                      fontWeight: 'semibold',
                      backgroundColor: Colors[colorScheme ?? 'light'].opSupport,
                      width: 40,
                      textAlign: 'center',
                      borderRadius: 5,
                      paddingVertical: 2,
                    }}>{getActiveOperations(fs.id ??'')}</Text>
                  )}
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
              <IconAtMap style={[styles.buttonIcon]} color={colorScheme === 'dark' ? '#fff' : '#000'}/>
            </Pressable>
            <Pressable style={styles.button} onPress={() => {setView(false)}}>
              <IconSymbol name="rectangle.grid.1x2" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </Pressable>
          </BlurView>
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
