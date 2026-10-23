import { StackHeader } from '@/components/navigation/StackHeader';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        // Keep content below the header, including on iOS 26+.
        headerTransparent: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        header:
          Platform.OS === 'android'
            ? (props) => <StackHeader {...props} />
            : undefined,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Settings',
        }}
      />
    </Stack>
  );
}

export default StackLayout;
