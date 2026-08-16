import districtData from "@/assets/data/districts.json";
import federStatesData from "@/assets/data/federal-states.json";
import IconAtMap from "@/assets/icons/map-at.svg";
import { SvgAtFederalStateMap } from "@/components/assets/SvgAtFederalStateMap";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { uiError } from "@/components/ui/ErrorMessage";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LiquidGlassView } from "@/components/ui/LiquidGlassView";
import { Colors } from "@/constants/Colors";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { FederalState } from "@/models/FederalState";
import { LocationStatistic } from "@/models/LocationStatistic";
import { OperationService } from "@/services/OperationService";
import { title } from "@/utils/TitleFunction";
import { useHeaderTitleOnFocus } from "@/utils/UseHeaderTitleOnFocus";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { BlurTargetView } from "expo-blur";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

export default function OperationSelectDistrict() {
  const { t } = useTranslation();
  const { federalStateId } = useLocalSearchParams<{ federalStateId: string }>();
  const colorScheme = useColorScheme();
  const dynamicSide = useDynamicSide();
  const blurTargetRef = useRef<View | null>(null);
  const mapBottomSpacing =
    dynamicSide.bottom + (Platform.OS === "ios" ? 0 : 50);
  const router = useRouter();
  const navigation = useNavigation();
  const [isMapView, setIsMapView] = useState(true);
  const [statistic, setStatistic] = useState<LocationStatistic[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [blurTargetReady, setBlurTargetReady] = useState(false);

  const [lastDataUpdate, setLastDataUpdate] = useState<Date | null>(null);

  const federalStates: FederalState[] = [];
  var federalState: FederalState | null =
    federalStates.find((fs) => fs.idLong === federalStateId) || null;
  const districts: { id: string; name: string }[] = [];

  const pageTitle = title(federalState?.name);
  useHeaderTitleOnFocus(pageTitle);

  loadFederalStatesFromData();

  useEffect(() => {
    getStatistic(federalStateId);
  }, [federalStateId]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: title(federalState?.name),
      });
    }, [navigation, federalState]),
  );

  useFocusEffect(
    useCallback(() => {
      getStatistic(federalStateId);
    }, [federalStateId]),
  );

  function loadFederalStatesFromData() {
    const data: FederalState[] = federStatesData.map((fs) => ({
      id: fs.id,
      idLong: fs.idLong,
      name: t(`assets.federalStates.${fs.id}`),
      disabled: false,
    }));

    data.sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      return a.name.localeCompare(b.name);
    });

    federalState = data.find((fs) => fs.idLong === federalStateId) || null;

    federalStates.push(...data);

    loadDistrictsFromData();
  }

  function loadDistrictsFromData() {
    if (federalState) {
      const data = districtData.find((d) => d.fdId === federalState?.id);
      if (data) {
        data.districts.forEach((d) => {
          districts.push({
            id: d,
            name: t(`assets.districts.${federalState?.id}.${d}`),
          });
        });

        districts.sort((a, b) => a.name.localeCompare(b.name));

        // add "all districts" option at the beginning
        districts.unshift({
          id: "all",
          name: t("operation.allOperations", {
            federalState: federalState?.name,
          }),
        });
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

  function getStatistic(federalStateId: string) {
    if (
      lastDataUpdate &&
      new Date().getTime() - lastDataUpdate.getTime() < 1000 * 10
    ) {
      setTimeout(() => {
        setLoaded(true);
      }, 150);
      return;
    }

    OperationService.getStatisticFromFederalStates(federalStateId)
      .then((data) => {
        setStatistic(data);
        setLoaded(true);
        setLastDataUpdate(new Date());
      })
      .catch((error) => {
        console.error("Error fetching statistic:", error);
        uiError(
          error.status === 404
            ? t("common.error.notFound")
            : t("common.error.internalServerError"),
        );
        setLoaded(true);
      });
  }

  function getActiveOperations(fsId: string): number {
    const fsStatistic = statistic.find((stat) => stat.nameId === fsId);
    return fsStatistic ? fsStatistic.countActive : 0;
  }

  if (loaded) {
    return (
      <>
        <ThemedView style={[styles.container]}>
          <BlurTargetView
            ref={blurTargetRef}
            onLayout={() => setBlurTargetReady(true)}
            style={styles.target}
          >
          {isMapView ? (
            <View
              style={[
                styles.contentMap,
                {
                  marginBottom: mapBottomSpacing,
                  paddingLeft: dynamicSide.left,
                  paddingRight: dynamicSide.right,
                },
              ]}
            >
              {/* Main Content */}
              <View
                style={{ flex: 1, display: "flex", marginHorizontal: "auto" }}
              >
                <SvgAtFederalStateMap
                  federalState={federalState?.id}
                  onSelect={(district) => handlePress(district)}
                  statistic={statistic}
                />
              </View>

              {/* Bottom Informations */}
              <Pressable
                onPress={() => {
                  setLoaded(false);
                  getStatistic(federalStateId);
                }}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  opacity: 0.25,
                  padding: 16,
                  alignContent: "center",
                  gap: 8,
                  alignSelf: "flex-start",
                  position: "absolute",
                  bottom: 0,
                  left: dynamicSide.left,
                }}
              >
                <IconSymbol
                  name={"arrow.2.circlepath"}
                  color={Colors[colorScheme ?? "light"].text}
                  size={16}
                />
                <Text
                  style={{
                    color: Colors[colorScheme ?? "light"].text,
                    fontSize: 12,
                  }}
                >
                  {lastDataUpdate?.toLocaleString()}
                </Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View
                style={[
                  styles.contentList,
                  {
                    marginBottom: dynamicSide.bottom + 50,
                    paddingLeft: dynamicSide.left,
                    paddingRight: dynamicSide.right,
                  },
                ]}
              >
                {districts.map((fs) => (
                  <Pressable
                    key={fs.id}
                    // onPress={() => selectFederalState(fs.id)}
                    style={({ pressed }) => ({
                      padding: 12,
                      borderBottomWidth: 1,
                      borderColor: Colors[colorScheme ?? "light"].border,
                      opacity: pressed ? 0.7 : 1,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      // cursor: fs.disabled ? 'not-allowed' : 'pointer',
                    })}
                    onPress={() => handlePress(fs.id)}
                  >
                    <ThemedText
                      style={{ color: Colors[colorScheme ?? "light"].text }}
                    >
                      {fs.name}
                    </ThemedText>
                    {getActiveOperations(fs.id ?? "") > 0 && (
                      <Text
                        style={{
                          color: Colors[colorScheme ?? "light"].opSupportText,
                          fontSize: 16,
                          fontWeight: "semibold",
                          backgroundColor:
                            Colors[colorScheme ?? "light"].opSupport,
                          width: 40,
                          textAlign: "center",
                          borderRadius: 5,
                          paddingVertical: 2,
                        }}
                      >
                        {getActiveOperations(fs.id ?? "")}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          )}
          </BlurTargetView>

          <LiquidGlassView
            style={[
              {
                marginBottom: mapBottomSpacing,
                position: "absolute",
                bottom: 20,
                right: 20,
                zIndex: 2,
                backgroundColor:
                  Platform.OS === "ios"
                    ? "transparent"
                    : Colors[colorScheme ?? "light"].tint + "15",
                marginRight: dynamicSide.right,
                borderRadius: Platform.OS === "ios" ? 20 : 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
            ]}
            colorScheme={colorScheme === "dark" ? "dark" : "light"}
            tintColor={Colors[colorScheme ?? "light"].tint + "15"}
            blurTarget={blurTargetReady ? blurTargetRef : undefined}
          >
            <Pressable
              style={[styles.button, { opacity: isMapView ? 0.75 : 0.32 }]}
              onPress={() => {
                setView(true);
              }}
            >
              <IconAtMap
                style={[styles.buttonIcon]}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
            </Pressable>
            <Pressable
              style={[styles.button, { opacity: !isMapView ? 0.75 : 0.32 }]}
              onPress={() => {
                setView(false);
              }}
            >
              <IconSymbol
                name="rectangle.grid.1x2"
                size={24}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
            </Pressable>
          </LiquidGlassView>
        </ThemedView>
      </>
    );
  } else {
    return (
      <>
        <Stack.Screen options={{ title: federalState?.name }} />
        <ThemedView
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme ?? "light"].tint}
          />
        </ThemedView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  target: {
    flex: 1,
  },
  contentMap: {
    display: "flex",
    flex: 1,
    flexGrow: 1,
    position: "relative",
  },
  contentList: {
    width: "100%",
    maxWidth: 1000,
    marginHorizontal: "auto",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 10,
  },
  button: {
    width: 50,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    fontSize: 12,
    opacity: 0.32,
  },
  buttonIcon: {
    width: "100%",
    height: "100%",
    maxHeight: 24,
    maxWidth: 36,
    marginBottom: 2,
  },
});
