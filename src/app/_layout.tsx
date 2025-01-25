import { AppProvider } from "@/contexts";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AppProvider>
  );
}
