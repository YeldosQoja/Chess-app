import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: 'auth',
}

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="auth"/>
      <Stack.Screen name="index" />
    </Stack>
  );
}
