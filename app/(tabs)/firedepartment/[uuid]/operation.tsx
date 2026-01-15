import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { DatePickerField } from "@/components/ui/DatePickerField";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { OperationTypeView } from "@/components/ui/OperationTypeView";
import { Colors } from "@/constants/Colors";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { Operation } from "@/models/Operation";
import { Page } from "@/models/Page";
import { FiredepartmentService } from "@/services/FiredeparmentService";
import { title } from "@/utils/TitleFunction";
import { useHeaderTitleOnFocus } from "@/utils/UseHeaderTitleOnFocus";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Animated, FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

export default function FiredepartmentOperationScreen() {
  const dynamicSide = useDynamicSide();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { t } = useTranslation();

  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [openOptions, setOpenOptions] = useState(false);
  const animateOptions = useRef(new Animated.Value(0)).current; 

  const [operations, setOperations] = useState<Page<Operation>>({
    size: 25,
  } as Page<Operation>);
  const [filter, setFilter] = useState({
    dateStart: undefined as Date | undefined,
    dateEnd: undefined as Date | undefined,
    operationType: undefined,
  });
  
  const pageTitle = title(t('firedepartment.details.operations.title'));
  
  useHeaderTitleOnFocus(pageTitle);

  useEffect(() => {
    loadOperations();
    }, [uuid]);

  function loadOperations(): void {
    setLoading(true);
    FiredepartmentService.getFiredepartmentOperations(uuid, operations.size, operations.number, filter.dateStart, filter.dateEnd, filter.operationType)
      .then(setOperations)
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function loadMoreOperations(): void {
    if (operations.last) return;
    setLoadingMore(true);
    FiredepartmentService.getFiredepartmentOperations(uuid, operations.size, operations.number + 1, filter.dateStart, filter.dateEnd, filter.operationType)
      .then((newOps) => {
        setOperations({
          ...newOps,
          content: [...operations.content, ...newOps.content],
        });
        setLoadingMore(false);
      });
  }

  function getDate(dateString: string | undefined): string {
    if(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return t('common.unknown');
    }
  }

  function validateFilterDate() {
    if (filter.dateStart && filter.dateEnd) {
      if (filter.dateStart > filter.dateEnd) {
        setFilter(p => ({ ...p, dateEnd: undefined }));
      }
    }

    // if ((filter.dateEnd && filter.dateStart) || (!filter.dateEnd && !filter.dateStart)) {
    //   loadOperations();
    // }
      
  }

  // animation
  const toggleOptions = () => {
    setOpenOptions(!openOptions);
    Animated.timing(animateOptions, {
      toValue: openOptions ? 0 : 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  const optionsHeightMax = 180;
  const optionsHeight = animateOptions.interpolate({
    inputRange: [0, 1],
    outputRange: [0, optionsHeightMax],
  });

  return (
    <>
      <ThemedView style={styles.container}>
        <View style={[styles.containerScrollView]}>
          <Pressable
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              padding: 12
            }}
            onPress={toggleOptions}
          >
            <IconSymbol name="line.horizontal.3.decrease" color={Colors[colorScheme ?? 'light'].textSub} size={24} />
            <Text style={{ color: Colors[colorScheme ?? 'light'].textSub, fontSize: 16, marginLeft: 8, userSelect: 'none' }}>{t('firedepartment.details.operations.filter.title')}</Text>
          </Pressable>
          <Animated.View
            style={{
              height: optionsHeight,
              overflow: 'hidden',
            }}
          >
            <View style={{ padding: 12, height: optionsHeightMax }}>
              
              <ThemedText type="subtitle">{t('firedepartment.details.operations.filter.date.label')}</ThemedText>
              <View style={[styles.filterGroup, { flexDirection: 'row', gap: 12 }]}>
                <View style={[styles.filterGroupField, { flex: 1 }]}>
                  <ThemedText>{t('firedepartment.details.operations.filter.date.start')}</ThemedText>

                  <DatePickerField
                    style={{ width: '100%', marginTop: 4 }}
                    canUndefined={true}
                    value={filter.dateStart}
                    maxDate={new Date()}
                    onChange={(d) => {
                      setFilter(p => ({ ...p, dateStart: d }))
                      validateFilterDate();
                    }
                    }
                  />
                </View>

                <View style={[styles.filterGroupField, { flex: 1 }]}>
                  <ThemedText>{t('firedepartment.details.operations.filter.date.end')}</ThemedText>

                  <DatePickerField
                    style={{ width: '100%', marginTop: 4 }}
                    canUndefined={true}
                    value={filter.dateEnd}
                    maxDate={new Date()}
                    minDate={filter.dateStart}
                    onChange={(d) => {
                      setFilter(p => ({ ...p, dateEnd: d }))
                      validateFilterDate();
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  marginTop: 12,
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 12,
                  justifyContent: 'flex-end',
                }}>
                <Pressable
                  style={{
                    width: 80,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}
                  onPress={() => {
                    setFilter({ dateStart: undefined, dateEnd: undefined, operationType: undefined });
                    loadOperations();
                  }}>
                  <ThemedText style={{ color: Colors[colorScheme ?? 'light'].textSub }}>{t('firedepartment.details.operations.filter.buttons.reset')}</ThemedText>
                </Pressable>

                <Pressable
                  style={{
                    width: 80,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    backgroundColor: Colors[colorScheme ?? 'light'].linkBackground,
                  }}
                  onPress={() => {
                    loadOperations();
                  }}>
                  <ThemedText style={{ color: Colors[colorScheme ?? 'light'].linkForeground }}>{t('firedepartment.details.operations.filter.buttons.load')}</ThemedText>
                </Pressable>
              </View>

            </View>
          </Animated.View>
        </View>
        { loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: dynamicSide.bottom + 50 }}>
            <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
          </View>
        ) : (
          <FlatList 
            contentContainerStyle={[styles.containerScrollView]}
            data={operations.content}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.uuid}
            ListFooterComponent={
              <>
                { loadingMore ? (
                  <View style={{ marginVertical: 20 }}>
                    <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
                  </View>
                ) : null }
                <View style={{ height: dynamicSide.bottom + 50 }} />
              </>
            }
            onEndReached={loadMoreOperations}
            onEndReachedThreshold={1}
            renderItem={({ item: op }) => (
              <Pressable
                key={op.uuid}
                style={({ pressed }) => ({
                  padding: 12,
                  borderBottomWidth: 1,
                  borderColor: Colors[colorScheme ?? 'light'].border,
                  opacity: pressed ? 0.7 : 1,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                })}
                onPress={() => {
                  router.push({
                    pathname: "/operation/details/[uuid]",
                    params: { uuid: op.uuid }
                  });
                }}
              >
                {/* Alarm Message */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flex: 1,
                    overflow: 'hidden',
                  }}>
                  <ThemedText
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      color: Colors[colorScheme ?? 'light'].text,
                      fontWeight: 'bold',
                      fontSize: 18,
                      maxWidth: '100%',
                      textAlign: 'left',
                      }}>{op.alarm.message}</ThemedText>

                  {/* additional informations */}
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      gap: 12,
                      maxWidth: '100%',
                      overflow: 'hidden',
                    }}>
                    <ThemedText
                      style={{
                        color: Colors[colorScheme ?? 'light'].text,
                        fontSize: 14,
                        opacity: 0.5,
                        lineHeight: 15,
                        marginTop: 4,
                        }}>{getDate(op.startTime)}</ThemedText>

                    { op.address.location ? (                      
                      <ThemedText
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          color: Colors[colorScheme ?? 'light'].text,
                          fontSize: 14,
                          opacity: 0.5,
                          lineHeight: 15,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          flex: 1,
                        }}>{op.address.location}</ThemedText>
                    ) : (null) }
                  </View>
                </View>

                {/* Alarm Type */}
                <OperationTypeView alarm={op.alarm} size="list" />
              </Pressable>
            )}
          />
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerScrollView: {
    width: '100%',
    maxWidth: 1000,
    marginHorizontal: 'auto',
  },
  filterGroup: {
    marginBottom: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterGroupField: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  }
});