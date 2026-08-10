import { StackHeader } from '@/components/navigation/StackHeader';
import { Stack } from 'expo-router';

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        animationDuration: 300,
        header: (props) => <StackHeader {...props} />,
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
