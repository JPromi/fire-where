import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useDynamicBottom } from "@/hooks/useDynamicBottom";
import { Operation } from "@/models/Operation";
import { OperationService } from "@/services/OperationService";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, RefreshControl, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

export default function OperationDetailScreen() {
  const { t } = useTranslation();
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const colorScheme = useColorScheme();
  const marginBottom = useDynamicBottom();
  const animationValues = useRef<Animated.Value[]>([]);


  const [refreshing, setRefreshing] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

  const [operation, setOperation] = useState<Operation>({} as Operation);

  useEffect(() => {
    OperationService.getOperation(uuid)
              .then(setOperation)
              .catch(console.error);
  }, [uuid, t]);

  useEffect(() => {
    const count = (operation.firedepartments?.length || 0) + (operation.units?.length || 0);
    animationValues.current = Array.from({ length: count }, () => new Animated.Value(0));
  }, [operation]);
  
  function onRefresh() {
    setRefreshing(true);
    if (!uuid) return;

    OperationService.getOperation(uuid)
      .then(setOperation)
      .catch(console.error)
      .finally(() => setRefreshing(false));
  }

  function getOperationColor(type: string): string {
      switch (type) {
        case 'B':
          return Colors[colorScheme ?? 'light'].opFire;
        case 'T':
        case 'V':
          return Colors[colorScheme ?? 'light'].opTechnical;
        case 'G':
        case 'S':
          return Colors[colorScheme ?? 'light'].opChimical;
        case 'SOF':
          return Colors[colorScheme ?? 'light'].opSupport;
        default:
          return Colors[colorScheme ?? 'light'].opOther;
      }
  }

  function getDate(dateString: string | undefined): string {
    if(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return t('common.unknown');
    }
  }

  function expand(index: number) {
    const isExpanded = expandedItems[index];
    setExpandedItems(prev => ({ ...prev, [index]: !isExpanded }));

    Animated.timing(animationValues.current[index], {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  return (
    <>
      <Stack.Screen options={{
        title: operation.alarm?.message || t('common.unknown'),
        }} />
      <ThemedView style={[styles.container, { paddingBottom: marginBottom + 50 }]}>
        <ScrollView
          style={{
            flex: 1,
            padding: 20,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          }>
          {/* Top Informations */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              marginBottom: 20,
              width: '100%',
              maxWidth: 1000,
              alignSelf: 'center',
            }}>
            {/* Header */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>

              {/* Alarm Type */}
              { operation.alarm?.level?.toString() || operation.alarm?.type || operation.alarm?.levelAddition ? (
                // B2T
                <View
                  style={{
                    backgroundColor: getOperationColor(operation.alarm?.type || ''),
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors[colorScheme ?? 'light'].text,
                      fontWeight: 'bold',
                      fontSize: `${operation.alarm.type || ''}${operation.alarm.level?.toString() || ''}${operation.alarm.levelAddition || ''}`.length <= 2 ? 28 : 20,
                    }}>{operation.alarm?.type}{operation.alarm?.level}{operation.alarm?.levelAddition}</Text>
                </View>
              ) : (
                // FW-A-BRANDG
                <View
                  style= {{
                    padding: 2,
                    minWidth: 82,
                    height: 52,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors[colorScheme ?? 'light'].opTechnical,
                  }}>
                  <Text
                    style={{
                      color: Colors[colorScheme ?? 'light'].text,
                      fontWeight: 'semibold',
                      fontSize: 14,
                    }}>{`${operation.alarm?.tyrolOutOrder}`}</Text>
                  <Text
                    style={{
                      color: Colors[colorScheme ?? 'light'].text,
                      fontWeight: 'bold',
                      fontSize: (operation.alarm?.tyrolCategory?.length ?? 0) >= 8 ? 16 : 20,
                    }}>{`${operation.alarm?.tyrolCategory}`}</Text>
                </View>
              )}

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  flex: 1,
                }}>
                <ThemedText
                  // numberOfLines={1}
                  // ellipsizeMode="tail"
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    maxWidth: '90%',
                    textAlign: 'right',
                  }}>{operation.alarm?.message}</ThemedText>
                <ThemedText
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontWeight: 'regular',
                    fontSize: 14,
                    maxWidth: '90%',
                    textAlign: 'right',
                    opacity: 0.5,
                  }}>{operation.address?.location}</ThemedText>
              </View>

            </View>

            {/* Informations */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 12,
                justifyContent: 'space-between',
              }}>
                <View>
                  <ThemedText
                    style={{
                      opacity: 0.5,
                      fontSize: 14,
                      lineHeight: 15,
                    }}>{t('operation.details.alarmed')}</ThemedText>
                  <ThemedText>{getDate(operation.startTime)}</ThemedText>
                </View>
            </View>
          </View>

          {/* Units and Firedepartments */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 12,
              flexWrap: 'wrap',
              maxWidth: 1000,
              width: '100%',
              alignSelf: 'center',
            }}>
            {operation.firedepartments?.map((fd, index) => {
              const animatedHeight = animationValues.current[index]
                ? animationValues.current[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 125],
                  }) : 0;
              return (
                <View
                    key={index}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: Colors[colorScheme ?? 'light'].backgroundForground,
                      width: '100%',
                      maxWidth: 494,
                    }}>
                  <Pressable
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      width: '100%',
                    }}
                    onPress={() => expand(index)}>
                    <IconSymbol size={28} name="house.fill" color={Colors[colorScheme ?? 'light'].text} />
                    <ThemedText
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: Colors[colorScheme ?? 'light'].text,
                        fontWeight: 'bold',
                        fontSize: 16,
                        maxWidth: '90%',
                      }}>
                      {fd.firedepartment?.name ?? t('operation.details.unit.placeholderFiredepartment')}
                    </ThemedText>
                  </Pressable>

                  <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        marginTop: 8,
                      }}>
                        <View style={styles.extendedInformationLine}>
                          <ThemedText style={styles.extendedInformationLineDescription}>{t('operation.details.unit.alarmed')}</ThemedText>
                          <ThemedText>{ fd.alarmTime ? getDate(fd.alarmTime) : '---' }</ThemedText>
                        </View>
                        <View style={styles.extendedInformationLine}>
                          <ThemedText style={styles.extendedInformationLineDescription}>{t('operation.details.unit.disposition')}</ThemedText>
                          <ThemedText>{ fd.dispoTime ? getDate(fd.dispoTime) : '---' }</ThemedText>
                        </View>
                        <View style={styles.extendedInformationLine}>
                          <ThemedText style={styles.extendedInformationLineDescription}>{t('operation.details.unit.out')}</ThemedText>
                          <ThemedText>{ fd.outTime ? getDate(fd.outTime) : '---' }</ThemedText>
                        </View>
                        <View style={styles.extendedInformationLine}>
                          <ThemedText style={styles.extendedInformationLineDescription}>{t('operation.details.unit.in')}</ThemedText>
                          <ThemedText>{ fd.inTime ? getDate(fd.inTime) : '---' }</ThemedText>
                        </View>
                    </View>
                  </Animated.View>
                </View>
              )
            })}
            {operation.units?.map((fd, index) => {
              index += operation.firedepartments?.length || 0;
              const animatedHeight = animationValues.current[index]
                ? animationValues.current[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 125],
                  }) : 0;
              return (
                <View
                    key={index}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: Colors[colorScheme ?? 'light'].backgroundForground,
                      width: '100%',
                      maxWidth: 494,
                    }}>
                  <Pressable
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      width: '100%',
                    }}
                    onPress={() => expand(index)}>
                    <IconSymbol size={28} name="car.fill" color={Colors[colorScheme ?? 'light'].text} />
                    <ThemedText
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: Colors[colorScheme ?? 'light'].text,
                        fontWeight: 'bold',
                        fontSize: 16,
                        maxWidth: '90%',
                      }}>
                      {fd.unit?.name ?? t('operation.details.unit.placeholderUnit')}
                    </ThemedText>
                  </Pressable>

                  <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        marginTop: 8,
                      }}>
                        <View style={styles.extendedInformationLine}>
                          <ThemedText style={styles.extendedInformationLineDescription}>{t('operation.details.unit.alarmed')}</ThemedText>
                          <ThemedText>{ fd.alarmTime ? getDate(fd.alarmTime) : '---' }</ThemedText>
                        </View>
                        <View style={styles.extendedInformationLine}>
                          <ThemedText style={styles.extendedInformationLineDescription}>{t('operation.details.unit.disposition')}</ThemedText>
                          <ThemedText>{ fd.dispoTime ? getDate(fd.dispoTime) : '---' }</ThemedText>
                        </View>
                        <View style={styles.extendedInformationLine}>
                          <ThemedText style={styles.extendedInformationLineDescription}>{t('operation.details.unit.out')}</ThemedText>
                          <ThemedText>{ fd.outTime ? getDate(fd.outTime) : '---' }</ThemedText>
                        </View>
                        <View style={styles.extendedInformationLine}>
                          <ThemedText style={styles.extendedInformationLineDescription}>{t('operation.details.unit.in')}</ThemedText>
                          <ThemedText>{ fd.inTime ? getDate(fd.inTime) : '---' }</ThemedText>
                        </View>
                    </View>
                  </Animated.View>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Montserrat',
  },
  extendedInformationLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extendedInformationLineDescription: {
    opacity: 0.5,
  }
});
