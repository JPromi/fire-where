import { ThemedView } from "@/components/ThemedView";
import { title } from "@/utils/TitleFunction";
import { useHeaderTitleOnFocus } from "@/utils/UseHeaderTitleOnFocus";
import { StyleSheet } from "react-native";

export default function FiredepartmentOperationScreen() {
  
  const pageTitle = title("Einsätze");
  
  useHeaderTitleOnFocus(pageTitle);

  return (
    <>
      <ThemedView style={styles.container}></ThemedView>
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
  }
});