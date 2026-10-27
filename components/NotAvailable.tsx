import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function NotAvailableScreen() {
  const { t } = useTranslation();

  function getPlatformSpecificMessage() {
    switch (Platform.OS) {
      case "web":
        return t("errorPage.functionalityNotAvailable.web");
      case "ios":
      case "android":
        return t("errorPage.functionalityNotAvailable.mobile");
      default:
        return t("errorPage.functionalityNotAvailable.default");
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <ThemedText>{getPlatformSpecificMessage()}</ThemedText>

      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});