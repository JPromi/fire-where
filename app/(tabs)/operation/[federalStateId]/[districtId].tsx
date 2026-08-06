import districtData from '@/assets/data/districts.json';
import federStatesData from '@/assets/data/federal-states.json';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from "@/components/ThemedView";
import { uiError } from '@/components/ui/ErrorMessage';
import { OperationTypeView } from '@/components/ui/OperationTypeView';
import { Colors } from '@/constants/Colors';
import { useDynamicSide } from '@/hooks/useDynamicSide';
import { FederalState } from '@/models/FederalState';
import { Operation } from '@/models/Operation';
import { OperationService } from '@/services/OperationService';
import { title } from '@/utils/TitleFunction';
import { useHeaderTitleOnFocus } from '@/utils/UseHeaderTitleOnFocus';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, useColorScheme, View } from "react-native";

export default function OperationSelectDistrict() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { federalStateId, districtId } = useLocalSearchParams<{ federalStateId: string, districtId: string }>();
  const dynamicSide = useDynamicSide();
  const router = useRouter();

  const [federalState, setFederalState] = useState<FederalState | null>(null);
  const [districts, setDistricts] = useState<{ id: string, name: string }[]>([]);
  const [district, setDistrict] = useState<{ id: string, name: string }>({ id: districtId, name: "" });
  const [operations, setOperations] = useState<Operation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const pageTitle = title(district.name);
  useHeaderTitleOnFocus(pageTitle);


  useEffect(() => {
    setLoading(true);

    // federal states data processing
    const fsData = federStatesData.map(fs => ({
      id: fs.id,
      idLong: fs.idLong,
      name: t(`assets.federalStates.${fs.id}`),
      disabled: false,
    })).sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      return a.name.localeCompare(b.name);
    });

    const fs = fsData.find(fs => fs.idLong === federalStateId) || null;
    setFederalState(fs);

    if (fs) {
      getOperations(fs.id, fs.idLong, fs.name, districtId);
    } else {
      console.error(t('operation.noFederalStateData', { federalStateId }));
      setLoading(false);
    }
  }, [districtId]);

  function getOperations(fsId: string, fsIdLong: string, fsName: string, dist?: string) {
    // districts data processing
    const rawDistrictData = districtData.find(d => d.fdId === fsId);
    if (rawDistrictData) {

      let dist;

      if (districtId === 'all') {
        const distAll = { id: 'all', name: t('operation.allOperations', { federalState: fsName }) };
        setDistrict(distAll);
        setDistricts([distAll]);

        dist = distAll;
      } else {
        const distList = rawDistrictData.districts.map(d => ({
          id: d,
          name: t(`assets.districts.${fsId}.${d}`),
        })).sort((a, b) => a.name.localeCompare(b.name));

        setDistricts(distList);

        dist = distList.find(d => d.id === districtId) || { id: districtId, name: '' };
        setDistrict(dist);
      }

      // fetch operations
      if (dist.id === 'all') {
        OperationService.getOperationsByFs(fsIdLong)
          .then(setOperations)
          .catch(console.error)
          .finally(() => {
            setLoading(false);
          });
      } else {
        OperationService.getOperationsByFsDistrict(fsIdLong, dist.id)
          .then(setOperations)
          .catch((error) => {
            console.error('Error fetching operations:', error);
            uiError(error.status === 404 ? t('common.error.notFound') : t('common.error.internalServerError'));
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      console.error(t('operation.noDistrictData', { federalState: fsName }));
      setLoading(false);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    if (!federalState) return;

    if (district.id === 'all') {
      OperationService.getOperationsByFs(federalState.idLong || '')
        .then(setOperations)
        .catch(console.error)
        .finally(() => {
          setRefreshing(false);
        });
    } else {
      OperationService.getOperationsByFsDistrict(federalState.idLong || '', district.id)
        .then(setOperations)
        .catch(console.error)
        .finally(() => {
          setRefreshing(false);
        });
    }
  }

  function handlePress(operationUuid: string) {
    if (operationUuid) {
      router.push({
        pathname: "/operation/details/[uuid]",
        params: { uuid: operationUuid },
      });
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
        minute: '2-digit',
      });
    } else {
      return t('common.unknown');
    }
  }

  return (
    <>
      <ThemedView style={[styles.container]}>
        { loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: dynamicSide.bottom + 50 }}>
            <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
            style={{ paddingLeft: dynamicSide.left, paddingRight: dynamicSide.right }}
            contentContainerStyle={{ flexGrow: 1 }}>
            <View style={[styles.contentList, { marginBottom: dynamicSide.bottom + 50 }]}>
              {operations.length === 0 ? (
                <ThemedText
                  style={{
                    textAlign: 'center',
                    color: Colors[colorScheme ?? 'light'].text,
                    fontSize: 16,
                    marginTop: 20,
                  }}>
                  {t('operation.noData')}
                </ThemedText>
              ) : (null) }
              {operations.map((op) => (
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
                  onPress={() => handlePress(op.uuid)}
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
              ))}
            </View>
          </ScrollView>
        ) }
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentList: {
    width: '100%',
    maxWidth: 1000,
    marginHorizontal: 'auto',
  },
});
