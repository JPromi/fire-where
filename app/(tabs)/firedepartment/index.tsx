import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { Firedepartment } from "@/models/Firedepartment";
import { FiredepartmentService } from "@/services/FiredeparmentService";
import { title } from "@/utils/TitleFunction";
import { useHeaderTitleOnFocus } from "@/utils/UseHeaderTitleOnFocus";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, TextInput, useColorScheme, View } from "react-native";

export default function FiredepartmentDetailScreen() {
  const dynamicSide = useDynamicSide();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { t } = useTranslation();

  const [firedepartments, setFiredepartments] = useState<Firedepartment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const pageTitle = title(t('firedepartment.title'));
  useHeaderTitleOnFocus(pageTitle);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setFiredepartments([]);
      return;
    }

    setLoading(true);

    const t = setTimeout(() => {
      FiredepartmentService.searchFiredepartments(query, 36, 0)
        .then((res) => {
          setFiredepartments(res.content);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  function searchChange(text: string) {
    setQuery(text);
  }

  function openFd(uuid: string) {
    if (!uuid) return;
    router.push({
        pathname: "/firedepartment/[uuid]",
        params: { uuid: uuid },
      });
  }

  function getFederalStateName(fsName: string) : string{
    switch (fsName) {
      case 'Lower Austria':
        return t('assets.federalStates.la');
      case 'Upper Austria':
        return t('assets.federalStates.ua');
      case 'Styria':
        return t('assets.federalStates.st');
      case 'Burgenland':
        return t('assets.federalStates.bl');
      case 'Vienna':
        return t('assets.federalStates.vi');
      case 'Carinthia':
        return t('assets.federalStates.ca');
      case 'Salzburg':
        return t('assets.federalStates.sb');
      case 'Tyrol':
        return t('assets.federalStates.ty');
      case 'Vorarlberg':
        return t('assets.federalStates.vb');
      default:
        return fsName;
    }
  }

  return (
    <>
        <ThemedView style={styles.container}>
          <ScrollView style={{
            flex: 1,
            paddingLeft: dynamicSide.left,
            paddingRight: dynamicSide.right,
            display: 'flex',
          }}
          contentContainerStyle={{ flexGrow: 1 }}>
            <View style={[styles.contentList, { flex: 1 }]}>
              {/* Search */}
              <View
                style={{
                  padding: 10,
                  marginVertical: 20,
                  marginHorizontal: 12,
                  backgroundColor: Colors[colorScheme ?? 'light'].backgroundForground,
                  borderRadius: 100,
                  display: 'flex',
                }}
                >
                <TextInput
                  placeholder={t('firedepartment.search.placeholder')}
                  onChangeText={searchChange}
                  style={
                    {
                      color: Colors[colorScheme ?? 'light'].text,
                      paddingHorizontal: 5,
                      ...Platform.select({
                        web: {
                          outline: 'none',
                        }
                      })
                    }
                  }/>
              </View>

              {/* List */}
              { loading ? (
                <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: dynamicSide.bottom + 50 }}>
                  <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
                </View>
              ) : firedepartments.length === 0 ? (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: dynamicSide.bottom + 50 }}>
                  <ThemedText style={{ color: Colors[colorScheme ?? 'light'].text, opacity: 0.5 }}>
                    { query ? t('firedepartment.search.error.noResults') : t('firedepartment.search.error.noQuery') }
                  </ThemedText>
                </View>
              ) : (
                <View style={{ flex: 1, marginBottom: dynamicSide.bottom + 50 }}>
                  {firedepartments.map((fd) => (
                    <Pressable
                      key={fd.uuid}
                      onPress={() => openFd(fd.uuid)}
                      style={({ pressed }) => ({
                        padding: 12,
                        borderBottomWidth: 1,
                        borderColor: Colors[colorScheme ?? 'light'].border,
                        opacity: pressed ? 0.7 : 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      })}>
                      {/* Name */}
                      <ThemedText
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          color: Colors[colorScheme ?? 'light'].text,
                          fontWeight: 'bold',
                          fontSize: 18,
                          maxWidth: '100%',
                          textAlign: 'left',
                          }}>{fd.name}</ThemedText>

                      {/* Sub */}
                      { fd.address.federalState && (
                        <View>
                          <ThemedText
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                                color: Colors[colorScheme ?? 'light'].text,
                                fontSize: 14,
                                opacity: 0.5,
                                lineHeight: 15,
                                marginTop: 4,
                              }}>{getFederalStateName(fd.address.federalState)}</ThemedText>
                        </View>
                      ) }
                    </Pressable>
                  ))}
                </View>
              )}

            </View>
          </ScrollView>
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
