import { ThemedView } from "@/components/ThemedView";
import { useDynamicSide } from "@/hooks/useDynamicSide";
import { Stack, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";

export default function FiredepartmentDetailScreen() {
  const dynamicSide = useDynamicSide();
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Feuerwehr",
        }}/>
        <ThemedView style={styles.container}>
          <Pressable onPress={() => {
            router.push(`/firedepartment/8e873c8c-92cc-4e03-ad7d-61771156fa2b`);
          }}>
            <Text>Test</Text>
          </Pressable>
        </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
