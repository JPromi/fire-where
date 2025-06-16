import { Stack } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { SvgAtMap } from '@/components/assets/SvgAtMap';
import { Text } from 'react-native-svg';

export default function OperationSelectFederalStateScreen() {
  // change svg selector and list
  return (
    <>
      <Stack.Screen options={{ title: 'Einsätze' }} />
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <SvgAtMap activeFs={["LA", "UA", "BL", "ST", "TY"]} onSelect={(fsId) => console.log('Ausgewählt:', fsId)}/>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={() => {}}>
            <Text>Karte</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {}}>
            <Text>Liste</Text>
          </Pressable>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    position: 'fixed',
    bottom: 20 + 50,
    right: 20,
    display: 'flex',
    flexDirection: 'row',
    zIndex: 100,
    backgroundColor: '#ffffff10',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ffffff20',
    color: '#ffffff',
  },
  button: {
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
