import { Stack } from 'expo-router';

const StackLayout = () => {
  return (
    <Stack>
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