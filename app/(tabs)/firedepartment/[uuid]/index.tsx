import FiredepartmentIcon from "@/assets/icons/firedepartment.svg";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { uiError } from "@/components/ui/ErrorMessage";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LiquidGlassView } from "@/components/ui/LiquidGlassView";
import { OperationTypeView } from "@/components/ui/OperationTypeView";
import { TagChip } from "@/components/ui/TagChip";
import { Colors } from "@/constants/Colors";
import { CONFIG } from "@/constants/Config";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { Firedepartment } from "@/models/Firedepartment";
import { Operation } from "@/models/Operation";
import { FiredepartmentService } from "@/services/FiredeparmentService";
import { FavouritesService } from "@/services/local/FavouritesService";
import { title } from "@/utils/TitleFunction";
import { useHeaderTitleOnFocus } from "@/utils/UseHeaderTitleOnFocus";
import * as faBrand from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { BlurTargetView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";

export default function FiredepartmentDetailScreen() {
  const dynamicSide = useDynamicSide();
  const screenWidth = Dimensions.get("window").width;
  const colorScheme = useColorScheme();
  const blurTargetRef = useRef<View | null>(null);
  const [loading, setLoading] = useState(true);
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const [operations, setOperations] = useState<Operation[]>([]);
  const [firedepartment, setFiredepartment] = useState<
    Firedepartment | undefined
  >(undefined);
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [favouriteCount, setFavouriteCount] = useState<number>(0);
  const [blurTargetReady, setBlurTargetReady] = useState(false);
  const pageTitle = title(firedepartment?.name ?? "...");
  useHeaderTitleOnFocus(pageTitle);

  useEffect(() => {
    setLoading(true);
    FiredepartmentService.getFiredepartmentByUuid(uuid)
      .then((fd) => {
        setFiredepartment(fd);
        checkIfFavourite(fd);
        loadActiveOperations();
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [uuid]);

  function loadActiveOperations(): void {
    FiredepartmentService.getFiredepartmentActiveOperations(uuid)
      .then(setOperations)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
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

  function onRefresh() {
    setRefreshing(true);
    if (!uuid) return;

    FiredepartmentService.getFiredepartmentByUuid(uuid)
      .then(setFiredepartment)
      .then(() => {
        loadActiveOperations();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setRefreshing(false));
  }

  function shareFiredepartment() {
    if (CONFIG.informations.app.webUrl === null) return;

    Share.share({
      url: `${CONFIG.informations.app.webUrl}/firedepartment/${firedepartment?.nameId ?? firedepartment?.uuid}`,
    });
  }

  function supportsShare() {
    if (!CONFIG.informations.app.webUrl) return false;
    if (Platform.OS !== "web") return true;
    return (
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
  }

  function toggleFavourite() {
    if (!firedepartment) return;

    if (isFavourite) {
      FavouritesService.removeFavourite(firedepartment.uuid)
        .then(() => {
          setIsFavourite(false);
        })
        .catch((error) => {
          console.error("Error removing favourite:", error);
        });
    } else {
      if (favouriteCount >= 10) {
        uiError(t("common.customError.maxFavouritesReached", { max: 10 }));
        return;
      }

      FavouritesService.addFavourite(firedepartment.uuid)
        .then(() => {
          setIsFavourite(true);
        })
        .catch((error) => {
          console.error("Error adding favourite:", error);
        });
    }

    // update favourite count
    FavouritesService.countFavourites()
      .then((count) => {
        setFavouriteCount(count);
      })
      .catch((error) => {
        console.error("Error counting favourites:", error);
      });
  }

  function checkIfFavourite(fd: Firedepartment) {
    if (!fd) return;

    // get count of favourites
    FavouritesService.countFavourites()
      .then((count) => {
        setFavouriteCount(count);
      })
      .catch((error) => {
        console.error("Error counting favourites:", error);
      });

    // check if firedepartment is favourite
    FavouritesService.isFavourite(fd.uuid)
      .then((result) => {
        setIsFavourite(result);
      })
      .catch((error) => {
        console.error("Error checking favourite:", error);
      });
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
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 6,
                  marginHorizontal: 14,
                  minHeight: 24,
                  width: 24,
                }}
              >
                <IconSymbol
                  name="square.and.arrow.up"
                  size={22}
                  color={Colors[colorScheme ?? "light"].tint}
                />
              </Pressable>
            ) : undefined,
        }}
      />
      <ThemedView style={styles.container}>
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
              size="small"
              color={Colors[colorScheme ?? "light"].tint}
            />
          </View>
        ) : firedepartment ? (
          <ScrollView
            contentContainerStyle={[
              styles.containerScrollView,
              { flexGrow: 1 },
            ]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View
              style={{
                marginBottom:
                  Platform.OS === "ios"
                    ? dynamicSide.bottom + 10
                    : dynamicSide.bottom + 50,
              }}
            >
              {/* Header Image */}
              <View
                style={{
                  position: "relative",
                  width: "100%",
                  marginTop: screenWidth > 1000 ? 20 : 0,
                  borderRadius: screenWidth > 1000 ? 8 : 0,
                  height: screenWidth > 1000 ? 200 : 150,
                  display: "flex",
                  overflow: "hidden",
                  justifyContent: "center",
                }}
              >
                <BlurTargetView
                  ref={blurTargetRef}
                  onLayout={() => setBlurTargetReady(true)}
                  style={StyleSheet.absoluteFill}
                >
                  <Image
                    source={{ uri: firedepartment.banner ?? "" }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                  {firedepartment.logo ? (
                    Platform.OS === "web" ? (
                      <img
                        src={firedepartment.logo ?? ""}
                        style={{
                          position: "absolute",
                          minWidth: 100,
                          height: "50%",
                          left: "5%",
                          objectFit: "contain",
                          filter:
                            "drop-shadow(0 0 10px " +
                            (Colors[colorScheme ?? "light"].background + "88") +
                            ")",
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          position: "absolute",
                          minWidth: "100%",
                          height: "100%",
                          shadowColor: Colors[colorScheme ?? "light"].background,
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.75,
                          shadowRadius: 10,
                        }}
                      >
                        {firedepartment.logo.split(".").pop()?.toLowerCase() ===
                        "svg" ? (
                          <SvgUri
                            uri={firedepartment.logo ?? ""}
                            width={100}
                            height="60%"
                            style={{
                              left: "5%",
                            }}
                            preserveAspectRatio="xMidYMid meet"
                          />
                        ) : (
                          <Image
                            source={{ uri: firedepartment.logo ?? "" }}
                            style={{
                              width: 100,
                              height: "60%",
                              left: "5%",
                              objectFit: "contain",
                            }}
                          />
                        )}
                      </View>
                    )
                  ) : null}
                </BlurTargetView>

                {/* Buttons */}
                <View
                  style={{
                    position: "absolute",
                    right: 10,
                    bottom: 10,
                    display: "flex",
                    flexDirection: "row-reverse",
                    gap: 10,
                  }}
                >
                  {/* favourite button */}
                  <LiquidGlassView
                    style={{
                      backgroundColor:
                        Platform.OS === "ios"
                          ? "transparent"
                          : Colors[colorScheme ?? "light"].tint + "15",
                      width: 40,
                      height: 40,
                      borderRadius: 100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    colorScheme={colorScheme === "dark" ? "dark" : "light"}
                    tintColor={Colors[colorScheme ?? "light"].tint + "15"}
                    blurTarget={blurTargetReady ? blurTargetRef : undefined}
                  >
                    <Pressable
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={toggleFavourite}
                    >
                      <IconSymbol
                        name="star.fill"
                        color={
                          isFavourite
                            ? Colors[colorScheme ?? "light"].favourite
                            : Colors[colorScheme ?? "light"].text
                        }
                        size={24}
                      />
                    </Pressable>
                  </LiquidGlassView>
                </View>
              </View>

              {/* content */}
              <View
                style={[
                  {
                    padding: 20,
                    paddingLeft: dynamicSide.left + 20,
                    paddingRight: dynamicSide.right + 20,
                    display: "flex",
                    flexDirection: "column",
                  },
                ]}
              >
                {/* Title, chips, links */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  {/* Title */}
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 28,
                      color: Colors[colorScheme ?? "light"].text,
                    }}
                  >
                    {firedepartment.name}
                  </Text>

                  {/* chips */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      columnGap: 8,
                      rowGap: 10,
                      marginBottom: 0,
                    }}
                  >
                    {firedepartment.isVolunteer && (
                      <TagChip
                        name={t("firedepartment.details.chip.volunteer")}
                        icon={"heart.fill"}
                        tagColor="#33C2CC"
                      />
                    )}
                    {operations.length === 0 && (
                      <TagChip
                        name={t("firedepartment.details.chip.ready")}
                        icon={"flame.fill"}
                        tagColor="#13F24E"
                      />
                    )}
                    {operations.length > 0 && (
                      <TagChip
                        name={t("firedepartment.details.chip.inOperation")}
                        icon={"flame.fill"}
                        tagColor="#d42619"
                      />
                    )}
                  </View>

                  {/* links */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 0,
                    }}
                  >
                    {firedepartment.links &&
                      firedepartment.links.map((link) => (
                        <Pressable
                          key={link.url}
                          onPress={() => Linking.openURL(link.url)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: 44,
                            height: 44,
                            justifyContent: "center",
                          }}
                        >
                          {(() => {
                            switch (link.type) {
                              case "instagram":
                                return (
                                  <>
                                    <FontAwesomeIcon
                                      icon={faBrand.faInstagram}
                                      size={25}
                                      color={
                                        Colors[colorScheme ?? "light"].textSub
                                      }
                                    />
                                  </>
                                );
                              case "facebook":
                                return (
                                  <>
                                    <FontAwesomeIcon
                                      icon={faBrand.faFacebook}
                                      size={25}
                                      color={
                                        Colors[colorScheme ?? "light"].textSub
                                      }
                                    />
                                  </>
                                );
                              case "x":
                                return (
                                  <>
                                    <FontAwesomeIcon
                                      icon={faBrand.faXTwitter}
                                      size={25}
                                      color={
                                        Colors[colorScheme ?? "light"].textSub
                                      }
                                    />
                                  </>
                                );
                              case "youtube":
                                return (
                                  <>
                                    <FontAwesomeIcon
                                      icon={faBrand.faYoutube}
                                      size={25}
                                      color={
                                        Colors[colorScheme ?? "light"].textSub
                                      }
                                    />
                                  </>
                                );
                              case "tiktok":
                                return (
                                  <>
                                    <FontAwesomeIcon
                                      icon={faBrand.faTiktok}
                                      size={25}
                                      color={
                                        Colors[colorScheme ?? "light"].textSub
                                      }
                                    />
                                  </>
                                );
                              case "flickr":
                                return (
                                  <>
                                    <FontAwesomeIcon
                                      icon={faBrand.faFlickr}
                                      size={25}
                                      color={
                                        Colors[colorScheme ?? "light"].textSub
                                      }
                                    />
                                  </>
                                );
                              default:
                                return (
                                  <>
                                    <IconSymbol
                                      name="globe"
                                      size={25}
                                      color={
                                        Colors[colorScheme ?? "light"].textSub
                                      }
                                    />
                                  </>
                                );
                            }
                          })()}
                        </Pressable>
                      ))}
                  </View>
                </View>

                {/* Active Operations */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    marginTop: 48,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 20,
                      marginBottom: 10,
                      color: Colors[colorScheme ?? "light"].text,
                    }}
                  >
                    {t(
                      "firedepartment.details.operationsOverview.currentOperations",
                    )}
                  </Text>
                  {operations.map((op) => (
                    <Pressable
                      key={op.uuid}
                      style={({ pressed }) => ({
                        padding: 12,
                        borderWidth: 1,
                        borderRadius: 8,
                        marginBottom: 12,
                        borderColor: Colors[colorScheme ?? "light"].border,
                        opacity: pressed ? 0.7 : 1,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                      })}
                      onPress={() => {
                        // navigate to operation detail
                        router.push({
                          pathname:
                            "/firedepartment/operation-details/[operationUuid]",
                          params: { operationUuid: op.uuid },
                        });
                      }}
                    >
                      {/* Alarm Message */}
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          flex: 1,
                          overflow: "hidden",
                        }}
                      >
                        <ThemedText
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{
                            color: Colors[colorScheme ?? "light"].text,
                            fontWeight: "bold",
                            fontSize: 18,
                            maxWidth: "100%",
                            textAlign: "left",
                          }}
                        >
                          {op.alarm.message}
                        </ThemedText>

                        {/* additional informations */}
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-end",
                            gap: 12,
                            maxWidth: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <ThemedText
                            style={{
                              color: Colors[colorScheme ?? "light"].text,
                              fontSize: 14,
                              opacity: 0.5,
                              lineHeight: 15,
                              marginTop: 4,
                            }}
                          >
                            {getDate(op.startTime)}
                          </ThemedText>

                          {op.address.location ? (
                            <ThemedText
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={{
                                color: Colors[colorScheme ?? "light"].text,
                                fontSize: 14,
                                opacity: 0.5,
                                lineHeight: 15,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                flex: 1,
                              }}
                            >
                              {op.address.location}
                            </ThemedText>
                          ) : null}
                        </View>
                      </View>

                      <OperationTypeView alarm={op.alarm} size="list" />
                    </Pressable>
                  ))}
                  <Pressable
                    style={({ pressed }) => ({
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 10,
                      gap: 8,
                      paddingVertical: 12,
                      borderRadius: 8,
                      opacity: pressed ? 0.7 : 1,
                      backgroundColor:
                        Colors[colorScheme ?? "light"].linkBackground,
                    })}
                    onPress={() => {
                      router.push({
                        pathname: "/firedepartment/[uuid]/operation",
                        params: {
                          uuid: firedepartment.nameId ?? firedepartment.uuid,
                        },
                      });
                    }}
                  >
                    <Text
                      style={{
                        color: Colors[colorScheme ?? "light"].linkForeground,
                        fontSize: 16,
                        fontWeight: "500",
                        textAlign: "center",
                        userSelect: "none",
                      }}
                    >
                      {t(
                        "firedepartment.details.operationsOverview.allOperations",
                      )}
                    </Text>
                    <IconSymbol
                      name="arrow.right"
                      size={18}
                      color={Colors[colorScheme ?? "light"].linkForeground}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          <>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: dynamicSide.bottom + 50,
                gap: 10,
              }}
            >
              <FiredepartmentIcon
                height={32}
                width={32}
                color={Colors[colorScheme ?? "light"].text}
              />
              <Text
                style={{
                  color: Colors[colorScheme ?? "light"].text,
                  fontSize: 16,
                }}
              >
                {t("common.customError.firedepartmentNotFound")}
              </Text>
            </View>
          </>
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
    width: "100%",
    maxWidth: 1000,
    marginHorizontal: "auto",
  },
});
