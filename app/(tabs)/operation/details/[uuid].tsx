import Firedepartment from "@/assets/icons/firedepartment.svg";
import Firetruck from "@/assets/icons/firetruck.svg";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { uiError } from "@/components/ui/ErrorMessage";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { OperationTypeView } from "@/components/ui/OperationTypeView";
import { Colors } from "@/constants/Colors";
import { CONFIG } from "@/constants/Config";
import { ServiceOriginEnum } from "@/enums/ServiceOriginEnum";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { Operation } from "@/models/Operation";
import { SettingService } from "@/services/local/SettingService";
import { OperationService } from "@/services/OperationService";
import { title } from "@/utils/TitleFunction";
import { useHeaderTitleOnFocus } from "@/utils/UseHeaderTitleOnFocus";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  PixelRatio,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

export default function OperationDetailScreen() {
  const { t } = useTranslation();
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const dynamicSide = useDynamicSide();
  const animationValues = useRef<Animated.Value[]>([]);
  const screenWidth = Dimensions.get("window").width;
  const [loading, setLoading] = useState(true);

  const [nerdMode, setNerdMode] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean;
  }>({});

  const [operation, setOperation] = useState<Operation | undefined>(undefined);

  const pageTitle = title(operation?.alarm?.message ?? "...");
  useHeaderTitleOnFocus(pageTitle);

  useEffect(() => {
    getOperation(uuid);
    // Load nerd mode setting
    SettingService.getByKey("nerdMode").then((value) => {
      if (value) {
        setNerdMode(value as boolean);
      } else {
        setNerdMode(false);
      }
    });
  }, [uuid]);

  useEffect(() => {
    const count =
      (operation?.firedepartments?.length || 0) +
      (operation?.units?.length || 0);
    animationValues.current = Array.from(
      { length: count },
      () => new Animated.Value(0),
    );
  }, [operation]);

  function getOperation(uuid: string, setLoadingState: boolean = true) {
    if (setLoadingState) {
      setLoading(true);
    }
    OperationService.getOperation(uuid)
      .then(setOperation)
      .catch((error) => {
        console.error(error);
        uiError(
          error.request.status === 404
            ? t("common.error.notFound")
            : t("common.error.internalServerError"),
        );
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }

  function onRefresh() {
    if (!uuid) return;
    setRefreshing(true);

    getOperation(uuid, false);
  }

  function getDate(dateString: string | undefined): string {
    if (dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return t("common.unknown");
    }
  }

  function getOperationTotalTime(): string {
    if (!operation.startTime) return "---";
    const start = new Date(operation.startTime);
    const end = operation.endTime ? new Date(operation.endTime) : new Date();
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")} ${t("common.time.hours")}`;
    } else {
      return `${minutes} ${t("common.time.minutes")}`;
    }
  }

  function expand(index: number) {
    const isExpanded = expandedItems[index];
    setExpandedItems((prev) => ({ ...prev, [index]: !isExpanded }));

    Animated.timing(animationValues.current[index], {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  function getAnonymizedUnitDate(dateString: string | undefined): string {
    if (!dateString) return t("common.unknown");

    const date = new Date(dateString);
    var newDateString = date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (operation.system.serviceOrigin === ServiceOriginEnum.LA_WASTL_PUB) {
      newDateString = newDateString.slice(0, -1) + "x";
      return newDateString;
    } else {
      return newDateString;
    }
  }

  function shareFiredepartment() {
    if (CONFIG.informations.app.webUrl === null) return;

    Share.share({
      url: `${CONFIG.informations.app.webUrl}/operation/details/${operation?.uuid}`,
    });
  }

  function supportsShare() {
    if (!CONFIG.informations.app.webUrl) return false;
    if (Platform.OS !== "web") return true;
    return (
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () =>
            supportsShare() ? (
              <Pressable
                accessibilityLabel="Platzhalter"
                accessibilityRole="button"
                hitSlop={10}
                onPress={() => {
                  shareFiredepartment();
                }}
              >
                <IconSymbol
                  name="square.and.arrow.up"
                  size={22}
                  color={Colors[theme].tint}
                />
              </Pressable>
            ) : undefined,
        }}
      />
      <ThemedView style={[styles.container]}>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: dynamicSide.bottom + 50,
            }}
          >
            <ActivityIndicator
              size="large"
              color={Colors[colorScheme ?? "light"].tint}
            />
          </View>
        ) : operation ? (
          <ScrollView
            style={{
              flex: 1,
              paddingLeft: dynamicSide.left,
              paddingRight: dynamicSide.right,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View
              style={{
                padding: 20,
                paddingBottom:
                  Platform.OS === "ios"
                    ? dynamicSide.bottom + 20
                    : dynamicSide.bottom + 20 + 50,
              }}
            >
              {/* Top Informations */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  marginBottom: 20,
                  width: "100%",
                  maxWidth: 1000,
                  alignSelf: "center",
                }}
              >
                {/* Header */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <OperationTypeView alarm={operation.alarm} size="detail" />

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      flex: 1,
                    }}
                  >
                    <ThemedText
                      // numberOfLines={1}
                      // ellipsizeMode="tail"
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        maxWidth: "90%",
                        textAlign: "right",
                      }}
                    >
                      {operation.alarm?.message}
                    </ThemedText>
                    <ThemedText
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontWeight: "regular",
                        fontSize: 14,
                        maxWidth: "90%",
                        textAlign: "right",
                        opacity: 0.5,
                      }}
                    >
                      {operation.address?.location}
                    </ThemedText>
                  </View>
                </View>

                {/* Informations */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 12,
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <ThemedText
                      style={{
                        opacity: 0.5,
                        fontSize: 14,
                        lineHeight: 15,
                      }}
                    >
                      {t("operation.details.alarmed")}
                    </ThemedText>
                    <ThemedText>{getDate(operation.startTime)}</ThemedText>
                  </View>

                  <View>
                    <ThemedText
                      style={{
                        opacity: 0.5,
                        fontSize: 14,
                        lineHeight: 15,
                        textAlign: "right",
                      }}
                    >
                      {operation.endTime
                        ? t("operation.details.operationDuration")
                        : t("operation.details.inOperationSince")}
                    </ThemedText>
                    <ThemedText
                      style={{
                        textAlign: "right",
                      }}
                    >
                      {getOperationTotalTime()}
                    </ThemedText>
                  </View>
                </View>
              </View>

              {/* Units and Firedepartments */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 12,
                  flexWrap: "wrap",
                  maxWidth: 1000,
                  width: "100%",
                  alignSelf: "center",
                }}
              >
                {operation.firedepartments?.map((fd, index) => {
                  const animatedHeight = animationValues.current[index]
                    ? animationValues.current[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 125 * PixelRatio.getFontScale()],
                      })
                    : 0;
                  return (
                    <View
                      key={index}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor:
                          Colors[colorScheme ?? "light"].backgroundForground,
                        width: "100%",
                        maxWidth:
                          screenWidth > 700
                            ? screenWidth > 1040
                              ? 500 - 6
                              : (screenWidth -
                                  40 -
                                  dynamicSide.left -
                                  dynamicSide.right) *
                                  0.5 -
                                7
                            : 700,
                      }}
                    >
                      <Pressable
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 12,
                          width: "100%",
                        }}
                        onPress={() => expand(index)}
                      >
                        <View style={styles.extendedInformationIcon}>
                          <Firedepartment
                            height={28}
                            width={28}
                            color={Colors[colorScheme ?? "light"].text}
                          />
                          {fd.inTime ? (
                            <IconSymbol
                              name="arrow.left"
                              color={Colors[colorScheme ?? "light"].text}
                              size={14}
                            />
                          ) : fd.outTime ? (
                            <IconSymbol
                              name="arrow.right"
                              color={Colors[colorScheme ?? "light"].text}
                              size={14}
                            />
                          ) : fd.alarmTime ? (
                            <IconSymbol
                              name="wave.3.right"
                              color={Colors[colorScheme ?? "light"].text}
                              size={14}
                            />
                          ) : fd.dispoTime ? (
                            <IconSymbol
                              name="clipboard"
                              color={Colors[colorScheme ?? "light"].text}
                              size={14}
                            />
                          ) : null}
                        </View>
                        <ThemedText
                          numberOfLines={expandedItems[index] ? undefined : 1}
                          ellipsizeMode="tail"
                          style={{
                            marginTop: 2,
                            color: Colors[colorScheme ?? "light"].text,
                            fontWeight: "bold",
                            fontSize: 16,
                            maxWidth: "90%",
                            flex: 1,
                          }}
                        >
                          {fd.firedepartment?.name ??
                            t(
                              "operation.details.unit.placeholderFiredepartment",
                            )}
                        </ThemedText>
                        <View
                          style={{
                            transform: [
                              {
                                rotate: expandedItems[index]
                                  ? "180deg"
                                  : "0deg",
                              },
                            ],
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconSymbol
                            name="chevron.down"
                            size={18}
                            color={Colors[colorScheme ?? "light"].text}
                          />
                        </View>
                      </Pressable>

                      <Animated.View
                        style={{ height: animatedHeight, overflow: "hidden" }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            marginTop: 8,
                          }}
                        >
                          <View style={styles.extendedInformationLine}>
                            <ThemedText
                              style={styles.extendedInformationLineDescription}
                            >
                              {t("operation.details.unit.alarmed")}
                            </ThemedText>
                            <ThemedText>
                              {fd.alarmTime
                                ? getAnonymizedUnitDate(fd.alarmTime)
                                : "---"}
                            </ThemedText>
                          </View>
                          <View style={styles.extendedInformationLine}>
                            <ThemedText
                              style={styles.extendedInformationLineDescription}
                            >
                              {t("operation.details.unit.disposition")}
                            </ThemedText>
                            <ThemedText>
                              {fd.dispoTime
                                ? getAnonymizedUnitDate(fd.dispoTime)
                                : "---"}
                            </ThemedText>
                          </View>
                          <View style={styles.extendedInformationLine}>
                            <ThemedText
                              style={styles.extendedInformationLineDescription}
                            >
                              {t("operation.details.unit.out")}
                            </ThemedText>
                            <ThemedText>
                              {fd.outTime
                                ? getAnonymizedUnitDate(fd.outTime)
                                : "---"}
                            </ThemedText>
                          </View>
                          <View style={styles.extendedInformationLine}>
                            <ThemedText
                              style={styles.extendedInformationLineDescription}
                            >
                              {t("operation.details.unit.in")}
                            </ThemedText>
                            <ThemedText>
                              {fd.inTime
                                ? getAnonymizedUnitDate(fd.inTime)
                                : "---"}
                            </ThemedText>
                          </View>
                        </View>
                      </Animated.View>
                    </View>
                  );
                })}
                {operation.units?.map((fd, index) => {
                  index += operation.firedepartments?.length || 0;
                  const animatedHeight = animationValues.current[index]
                    ? animationValues.current[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 125 * PixelRatio.getFontScale()],
                      })
                    : 0;
                  return (
                    <View
                      key={index}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor:
                          Colors[colorScheme ?? "light"].backgroundForground,
                        width: "100%",
                        maxWidth:
                          screenWidth > 700
                            ? screenWidth > 1040
                              ? 500 - 6
                              : (screenWidth -
                                  40 -
                                  dynamicSide.left -
                                  dynamicSide.right) *
                                  0.5 -
                                6
                            : 700,
                      }}
                    >
                      <Pressable
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 12,
                          width: "100%",
                        }}
                        onPress={() => expand(index)}
                      >
                        <View style={styles.extendedInformationIcon}>
                          <Firetruck
                            height={28}
                            width={28}
                            color={Colors[colorScheme ?? "light"].text}
                          />
                          {fd.inTime ? (
                            <IconSymbol
                              name="arrow.left"
                              color={Colors[colorScheme ?? "light"].text}
                              size={14}
                            />
                          ) : fd.outTime ? (
                            <IconSymbol
                              name="arrow.right"
                              color={Colors[colorScheme ?? "light"].text}
                              size={14}
                            />
                          ) : fd.alarmTime ? (
                            <IconSymbol
                              name="wave.3.right"
                              color={Colors[colorScheme ?? "light"].text}
                              size={14}
                            />
                          ) : fd.dispoTime ? (
                            <IconSymbol
                              name="clipboard"
                              color={Colors[colorScheme ?? "light"].text}
                              size={14}
                            />
                          ) : null}
                        </View>
                        <ThemedText
                          numberOfLines={expandedItems[index] ? undefined : 1}
                          ellipsizeMode="tail"
                          style={{
                            marginTop: 2,
                            color: Colors[colorScheme ?? "light"].text,
                            fontWeight: "bold",
                            fontSize: 16,
                            maxWidth: "90%",
                            flex: 1,
                          }}
                        >
                          {fd.unit?.name ??
                            t("operation.details.unit.placeholderUnit")}
                        </ThemedText>
                        <View
                          style={{
                            transform: [
                              {
                                rotate: expandedItems[index]
                                  ? "180deg"
                                  : "0deg",
                              },
                            ],
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconSymbol
                            name="chevron.down"
                            size={18}
                            color={Colors[colorScheme ?? "light"].text}
                          />
                        </View>
                      </Pressable>

                      <Animated.View
                        style={{ height: animatedHeight, overflow: "hidden" }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            marginTop: 8,
                          }}
                        >
                          <View style={styles.extendedInformationLine}>
                            <ThemedText
                              style={styles.extendedInformationLineDescription}
                            >
                              {t("operation.details.unit.alarmed")}
                            </ThemedText>
                            <ThemedText>
                              {fd.alarmTime
                                ? getAnonymizedUnitDate(fd.alarmTime)
                                : "---"}
                            </ThemedText>
                          </View>
                          <View style={styles.extendedInformationLine}>
                            <ThemedText
                              style={styles.extendedInformationLineDescription}
                            >
                              {t("operation.details.unit.disposition")}
                            </ThemedText>
                            <ThemedText>
                              {fd.dispoTime
                                ? getAnonymizedUnitDate(fd.dispoTime)
                                : "---"}
                            </ThemedText>
                          </View>
                          <View style={styles.extendedInformationLine}>
                            <ThemedText
                              style={styles.extendedInformationLineDescription}
                            >
                              {t("operation.details.unit.out")}
                            </ThemedText>
                            <ThemedText>
                              {fd.outTime
                                ? getAnonymizedUnitDate(fd.outTime)
                                : "---"}
                            </ThemedText>
                          </View>
                          <View style={styles.extendedInformationLine}>
                            <ThemedText
                              style={styles.extendedInformationLineDescription}
                            >
                              {t("operation.details.unit.in")}
                            </ThemedText>
                            <ThemedText>
                              {fd.inTime
                                ? getAnonymizedUnitDate(fd.inTime)
                                : "---"}
                            </ThemedText>
                          </View>
                        </View>
                      </Animated.View>
                    </View>
                  );
                })}
              </View>
              {/* NerdInformations Information */}
              {nerdMode && (
                <>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      flexWrap: "wrap",
                      maxWidth: 1000,
                      width: "100%",
                      alignSelf: "center",
                      marginTop: 24,
                    }}
                  >
                    <ThemedText
                      style={{
                        borderBottomColor:
                          Colors[colorScheme ?? "light"].textSub,
                        borderBottomWidth: 1,
                        color: Colors[colorScheme ?? "light"].textSub,
                        padding: 4,
                        width: "100%",
                      }}
                    >
                      {t("operation.details.nerdInformation.system.title")}
                    </ThemedText>

                    <View style={styles.extendedInformationLine}>
                      <ThemedText>
                        {t(
                          "operation.details.nerdInformation.system.dataOrigin",
                        )}
                      </ThemedText>
                      <ThemedText style={{ opacity: 0.5 }}>
                        {t(
                          "assets.serviceOrigin." +
                            operation.system.serviceOrigin,
                        )}
                      </ThemedText>
                    </View>
                    <View style={styles.extendedInformationLine}>
                      <ThemedText>
                        {t(
                          "operation.details.nerdInformation.system.firstSeen",
                        )}
                      </ThemedText>
                      <ThemedText style={{ opacity: 0.5 }}>
                        {operation.system.firstSeen
                          ? getDate(operation.system.firstSeen)
                          : "---"}
                      </ThemedText>
                    </View>
                    <View style={styles.extendedInformationLine}>
                      <ThemedText>
                        {t(
                          "operation.details.nerdInformation.system.lastUpdate",
                        )}
                      </ThemedText>
                      <ThemedText style={{ opacity: 0.5 }}>
                        {operation.system.lastUpdate
                          ? getDate(operation.system.lastUpdate)
                          : "---"}
                      </ThemedText>
                    </View>
                    <View style={styles.extendedInformationLine}>
                      <ThemedText>
                        {t("operation.details.nerdInformation.system.lastSeen")}
                      </ThemedText>
                      <ThemedText style={{ opacity: 0.5 }}>
                        {operation.system.lastSeen
                          ? getDate(operation.system.lastSeen)
                          : "---"}
                      </ThemedText>
                    </View>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      maxWidth: 1000,
                      width: "100%",
                      alignSelf: "center",
                      marginTop: 24,
                    }}
                  >
                    <ThemedText
                      style={{
                        borderBottomColor:
                          Colors[colorScheme ?? "light"].textSub,
                        borderBottomWidth: 1,
                        color: Colors[colorScheme ?? "light"].textSub,
                        padding: 4,
                        width: "100%",
                      }}
                    >
                      {t("operation.details.nerdInformation.id.title")}
                    </ThemedText>

                    <View>
                      <ThemedText>
                        {t("operation.details.nerdInformation.id.uuid")}
                      </ThemedText>
                      <ThemedText style={{ opacity: 0.5 }} selectable={true}>
                        {operation.uuid}
                      </ThemedText>
                    </View>
                    {operation.system.serviceOrigin ===
                      ServiceOriginEnum.LA_WASTL_PUB && (
                      <>
                        <View>
                          <ThemedText>
                            {t(
                              "operation.details.nerdInformation.id.lowerAustriaWastlPubId",
                            )}
                          </ThemedText>
                          <ThemedText
                            style={{ opacity: 0.5 }}
                            selectable={true}
                          >
                            {operation.externalIds.lowerAustriaWastlPubId}
                          </ThemedText>
                        </View>
                        <View>
                          <ThemedText>
                            {t(
                              "operation.details.nerdInformation.id.lowerAustriaSysId",
                            )}
                          </ThemedText>
                          <ThemedText
                            style={{ opacity: 0.5 }}
                            selectable={true}
                          >
                            {operation.externalIds.lowerAustriaSysId}
                          </ThemedText>
                        </View>
                        <View>
                          <ThemedText>
                            {t(
                              "operation.details.nerdInformation.id.lowerAustriaId",
                            )}
                          </ThemedText>
                          <ThemedText
                            style={{ opacity: 0.5 }}
                            selectable={true}
                          >
                            {operation.externalIds.lowerAustriaId}
                          </ThemedText>
                        </View>
                      </>
                    )}
                    {operation.system.serviceOrigin ===
                      ServiceOriginEnum.BL_LSZ_PUB && (
                      <>
                        <View>
                          <ThemedText>
                            {t(
                              "operation.details.nerdInformation.id.burgenlandId",
                            )}
                          </ThemedText>
                          <ThemedText
                            style={{ opacity: 0.5 }}
                            selectable={true}
                          >
                            {operation.externalIds.burgenlandId}
                          </ThemedText>
                        </View>
                      </>
                    )}
                    {operation.system.serviceOrigin ===
                      ServiceOriginEnum.TYROL_LFS_APP && (
                      <>
                        <View>
                          <ThemedText>
                            {t(
                              "operation.details.nerdInformation.id.tyrolEventId",
                            )}
                          </ThemedText>
                          <ThemedText
                            style={{ opacity: 0.5 }}
                            selectable={true}
                          >
                            {operation.externalIds.tyrolEventId}
                          </ThemedText>
                        </View>
                      </>
                    )}
                    {operation.system.serviceOrigin ===
                      ServiceOriginEnum.ST_LFV_PUB && (
                      <>
                        <View>
                          <ThemedText>
                            {t("operation.details.nerdInformation.id.styriaId")}
                          </ThemedText>
                          <ThemedText
                            style={{ opacity: 0.5 }}
                            selectable={true}
                          >
                            {operation.externalIds.styriaId}
                          </ThemedText>
                        </View>
                      </>
                    )}
                    {operation.system.serviceOrigin ===
                      ServiceOriginEnum.UA_LFV_PUB && (
                      <>
                        <View>
                          <ThemedText>
                            {t(
                              "operation.details.nerdInformation.id.upperAustriaId",
                            )}
                          </ThemedText>
                          <ThemedText
                            style={{ opacity: 0.5 }}
                            selectable={true}
                          >
                            {operation.externalIds.upperAustriaId}
                          </ThemedText>
                        </View>
                      </>
                    )}
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: dynamicSide.bottom + 50,
              gap: 10,
            }}
          >
            {/* TODO: Icon */}
            <ThemedText
              style={{
                color: Colors[colorScheme ?? "light"].text,
                fontSize: 16,
              }}
            >
              {t("common.customError.operationNotFound")}
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  extendedInformationLine: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  extendedInformationLineDescription: {
    opacity: 0.5,
  },
  extendedInformationIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: 36,
    height: 30,
    justifyContent: "center",
  },
});
