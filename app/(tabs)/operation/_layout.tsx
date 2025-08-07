import { Stack } from 'expo-router';

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        animationDuration: 300,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Operationen',
        }}
      />
    </Stack>
  );
}

export default StackLayout;