import '@/i18n';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';
import { setCustomText } from 'react-native-global-props';
import { ErrorMessage } from '@/components/ui/ErrorMessage';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      setCustomText({
        style: { fontFamily: 'Montserrat' },
      });

      // set fontFamily for web
      if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.innerHTML = `
          * {
            font-family: 'Montserrat', sans-serif !important;
          }

          html, body {
            scrollbar-color: ${Colors[colorScheme ?? 'light'].backgroundForground} transparent;
            scrollbar-width: thin;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <ErrorMessage />
    </ThemeProvider>
  );
}
