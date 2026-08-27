import { Stack, useFocusEffect, useRouter } from "expo-router";
import { BlurTargetView } from "expo-blur";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import IconAtMap from "@/assets/icons/map-at.svg";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { FederalState } from "@/models/FederalState";
import { useCallback, useEffect, useRef, useState } from "react";

import federalStatesData from "@/assets/data/federal-states.json";
import { SvgAtMap } from "@/components/assets/SvgAtMap";
import { uiError } from "@/components/ui/ErrorMessage";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LiquidGlassView } from "@/components/ui/LiquidGlassView";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { LocationStatistic } from "@/models/LocationStatistic";
import { OperationService } from "@/services/OperationService";
import { ServiceService } from "@/services/ServiceService";
import { title } from "@/utils/TitleFunction";
import { useHeaderTitleOnFocus } from "@/utils/UseHeaderTitleOnFocus";
import { useTranslation } from "react-i18next";

export default function OperationSelectFederalStateScreen() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const router = useRouter();
  const dynamicSide = useDynamicSide();
  const blurTargetRef = useRef<View | null>(null);
  const mapBottomSpacing =
    dynamicSide.bottom + (Platform.OS === "ios" ? 0 : 50);
  const [isMapView, setIsMapView] = useState(true);
  const [statistic, setStatistic] = useState<LocationStatistic[]>([]);
  const [federalStates, setFederalStates] = useState<FederalState[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [blurTargetReady, setBlurTargetReady] = useState(false);

  const [lastDataUpdate, setLastDataUpdate] = useState<Date | null>(null);

  const pageTitle = title(t("operation.title"));
  useHeaderTitleOnFocus(pageTitle);

  useEffect(() => {
    setLoaded(false);
    setFederalStatesFromData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setFederalStatesFromData();
    }, []),
  );

  function setFederalStatesFromData() {
    const data: FederalState[] = federalStatesData.map((fs) => ({
      id: fs.id,
      idLong: fs.idLong,
      name: t(`assets.federalStates.${fs.id}`),
      disabled: true,
    }));

    ServiceService.getServices().then((services) => {
      data.forEach((fs) => {
        const service = services.find((s) => s.serviceName === `fs-${fs.id}`);
        if (service && service.isEnabled) {
          fs.disabled = false;
        }
      });

      data.sort((a, b) => {
        if (a.disabled && !b.disabled) return 1;
        if (!a.disabled && b.disabled) return -1;
        return a.name.localeCompare(b.name);
      });
      setFederalStates(data);

      getStatistic();
    });
  }

  function setView(isMap: boolean) {
    setIsMapView(isMap);
  }

  function getActiveFederalStates(): string[] {
    return federalStates.filter((fs) => !fs.disabled).map((fs) => fs.id);
  }

  function selectFederalState(fdId: string) {
    const found = federalStates.find((fs) => fs.id === fdId);
    const longId = found ? found.idLong : null;
    if (longId && !found?.disabled) {
      router.push({
        pathname: "/operation/[federalStateId]",
        params: { federalStateId: longId },
      });
    }
  }

  function getStatistic() {
    if (
      lastDataUpdate &&
      new Date().getTime() - lastDataUpdate.getTime() < 1000 * 10
    ) {
      setTimeout(() => {
        setLoaded(true);
      }, 150);
      return;
    }

    OperationService.getStatistic()
      .then((data) => {
        setStatistic(data);
        setLoaded(true);
        setLastDataUpdate(new Date());
      })
      .catch((error) => {
        console.error("Error fetching statistic:", error);
        uiError(t("common.error.internalServerError"));
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
        <ThemedView style={styles.container}>
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
                  paddingBottom: mapBottomSpacing,
                  paddingLeft: dynamicSide.left,
                  paddingRight: dynamicSide.right,
                },
              ]}
            >
              {/* Main Content */}
              <View
                style={{ flex: 1, display: "flex", marginHorizontal: "auto" }}
              >
                <SvgAtMap
                  activeFs={getActiveFederalStates()}
                  onSelect={(fsId) => selectFederalState(fsId)}
                  statistic={statistic}
                />
              </View>

              {/* Bottom Informations */}
              <Pressable
                onPress={() => {
                  setLoaded(false);
                  getStatistic();
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
                  bottom: mapBottomSpacing,
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
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => {
                    getStatistic();
                  }}
                />
              }
              style={{
                paddingLeft: dynamicSide.left,
                paddingRight: dynamicSide.right,
              }}
              contentContainerStyle={{ flexGrow: 1 }}
            >
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
                {federalStates.map((fs) => (
                  <Pressable
                    key={fs.id}
                    onPress={() => selectFederalState(fs.id)}
                    disabled={fs.disabled}
                    style={({ pressed }) => ({
                      padding: 12,
                      borderBottomWidth: 1,
                      borderColor: Colors[colorScheme ?? "light"].border,
                      opacity: fs.disabled ? 0.25 : pressed ? 0.7 : 1,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      // cursor: fs.disabled ? 'not-allowed' : 'pointer',
                    })}
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
                <Pressable
                  onPress={() => {
                    setLoaded(false);
                    getStatistic();
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    opacity: 0.25,
                    padding: 16,
                    alignContent: "center",
                    justifyContent: "center",
                    gap: 8,
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
        <Stack.Screen options={{ title: t("operation.title") }} />
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
  },
  button: {
    width: 50,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    fontSize: 12,
    // opacity: .32,
  },
  buttonIcon: {
    width: "100%",
    height: "100%",
    maxHeight: 24,
    maxWidth: 36,
    marginBottom: 2,
  },
});
