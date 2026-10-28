import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { LaInfoscreenService } from "@/services/LaInfoscreenService";
import { SettingService } from "@/services/local/SettingService";
import { title } from "@/utils/TitleFunction";
import { useHeaderTitleOnFocus } from "@/utils/UseHeaderTitleOnFocus";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";

export default function LaExtendedScreen() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const dynamicSide = useDynamicSide();
  const pageTitle = title(t("settings.laExtended.title"));
  useHeaderTitleOnFocus(pageTitle);

  // setting Values
  const [isExtendedViewEnabled, setIsExtendedViewEnabled] = useState(false);
  const [laAccessCode, setLaAccessCode] = useState<string | null>(null);

  const [isAuthorized, setIsAuthorized] = useState<boolean >(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean >(false);

  async function loadSettings() {
    const isExtendedMode = await SettingService.getByKey("laExtendedMode") === true;
    setIsExtendedViewEnabled(isExtendedMode);

    if (isExtendedMode) {
      auth();
    }
  }

  async function saveSettings(value: boolean) {
    let isConfirmed = false;

    if (value === false) {
      if (Platform.OS === "web") {
        if (window.confirm(`${t("settings.laExtended.confirmDisableExtendedMode")}\n\n${t("settings.laExtended.confirmDisableExtendedModeMessage")}`)) {
          isConfirmed = true;
        }
      } else {
        isConfirmed = await new Promise<boolean>((resolve) => {
          Alert.alert(t("settings.laExtended.confirmDisableExtendedMode"), t("settings.laExtended.confirmDisableExtendedModeMessage"), [
            {
              text: t("common.no"),
              style: "cancel",
              onPress: () => {
                resolve(false);
              }
            },
            {
              text: t("common.yes"),
              style: "default",
              onPress: () => {
                resolve(true);
              }
            },
          ]);
        })
      }

      if (isConfirmed) {
        setIsExtendedViewEnabled(value);
        await SettingService.setByKey("laExtendedMode", value);
        await SecureStore.deleteItemAsync("laInfoscreenAccessToken");
        await SecureStore.deleteItemAsync("laInfoscreenAccessCode");
        setIsAuthorized(false);
      }
    } else {
      auth();
      setIsExtendedViewEnabled(value);
      await SettingService.setByKey("laExtendedMode", value);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function auth() {
    setIsAuthLoading(true);
    LaInfoscreenService.getLoginState().then((res) => {
      if (res?.Token) {
        setLaAccessCode(res.Token);
      }
      if (res?.CurrentState === "data") {
        setIsAuthorized(true);
      }
      setIsAuthLoading(false);
    });
  }

  return (
    <>
      <ThemedView style={styles.container}>
        <ScrollView>
          <View
              style={[
                styles.contentList,
                {
                  paddingBottom: dynamicSide.bottom + 50,
                  paddingLeft: dynamicSide.left,
                  paddingRight: dynamicSide.right,
                },
              ]}
            >
              <View
                  style={{
                    marginBottom: 0,
                    padding: 10,
                  }}
                >

                  {/* Switch */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor:
                        Colors[colorScheme ?? "light"].backgroundForeground,
                      paddingHorizontal: 15,
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: 48,
                        borderTopWidth: 0,
                        borderTopColor:
                          Colors[colorScheme ?? "light"]
                            .backgroundForegroundBorder,
                      }}
                    >
                      <ThemedText
                          style={{
                            fontSize: 16,
                            color: Colors[colorScheme ?? "light"].text
                          }}
                        >
                        {t("settings.laExtended.extendedViewActivated")}
                        </ThemedText>
                      <Switch
                        value={isExtendedViewEnabled}
                        onValueChange={(value) => {
                          saveSettings(value);
                          auth();
                        }}
                        style={{
                          marginVertical: "auto",
                        }}
                      />
                    </View>
                  </View>
                </View>

                {/* Extended Infos */}
                {isExtendedViewEnabled && (
                  <View
                  style={{
                    marginBottom: 20,
                    padding: 10,
                  }}>
                    <ThemedText
                      style={{
                        fontSize: 15,
                        fontWeight: "light",
                        marginBottom: 5,
                        marginLeft: 15,
                        color: Colors[colorScheme ?? "light"].text,
                        opacity: 0.5,
                      }}
                    >
                      {t("settings.laExtended.authentication.title")}
                    </ThemedText>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor:
                          Colors[colorScheme ?? "light"].backgroundForeground,
                        paddingHorizontal: 15,
                        borderRadius: 10,
                      }}
                    >

                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          height: 48,
                          borderTopWidth: 0,
                          borderTopColor:
                            Colors[colorScheme ?? "light"]
                              .backgroundForegroundBorder,
                        }}
                      >
                        <ThemedText
                          style={{
                            fontSize: 16,
                            color: Colors[colorScheme ?? "light"].text
                          }}
                        >
                        {t("settings.laExtended.authentication.accessCode")}
                        </ThemedText>
                          { isAuthLoading ? (
                            <ActivityIndicator
                              size="small"
                              color={Colors[colorScheme ?? "light"].tint}
                            />
                          ) : (
                            <ThemedText
                              style={{
                                fontSize: 16,
                                color: Colors[colorScheme ?? "light"].text,
                              }}
                            >
                              { isAuthorized ? t("settings.laExtended.authentication.accessCodeAuthenticated") : laAccessCode ? laAccessCode : t("Loading...") }
                            </ThemedText>
                          )}
                      
                      </View>
                      
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          height: 48,
                          borderTopWidth: 0,
                          borderTopColor:
                            Colors[colorScheme ?? "light"]
                              .backgroundForegroundBorder,
                        }}
                      >
                        <ThemedText
                          style={{
                            fontSize: 16,
                            color: Colors[colorScheme ?? "light"].text
                          }}
                        >
                        {t("settings.laExtended.authentication.checkAccess")}
                        </ThemedText>
                        <Pressable
                            onPress={() => {

                              auth();
                            }}
                          >
                            <ThemedText
                              style={{
                                fontSize: 16,
                                color: Colors[colorScheme ?? "light"].textSub,
                              }}
                            >
                              {t("settings.laExtended.authentication.checkAccessButton")}
                            </ThemedText>
                          </Pressable>
                      </View>
                    </View>
                  </View>
                )}

                {/* Disclaimer */}
                <ThemedText
                  style={{
                    fontSize: 15,
                    fontWeight: "light",
                    marginBottom: 5,
                    marginLeft: 15,
                    color: Colors[colorScheme ?? "light"].text,
                    opacity: 0.5,
                  }}
                  >
                    {t("settings.laExtended.disclaimer1")}
                  </ThemedText>
                  <ThemedText
                  style={{
                    fontSize: 15,
                    fontWeight: "light",
                    marginBottom: 5,
                    marginLeft: 15,
                    color: Colors[colorScheme ?? "light"].text,
                    opacity: 0.5,
                  }}
                  >
                    {t("settings.laExtended.disclaimer2")}
                  </ThemedText>
            </View>
        </ScrollView>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentList: {
    width: "100%",
    maxWidth: 1000,
    marginHorizontal: "auto",
  },
});