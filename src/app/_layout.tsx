import { ThemeProvider } from "@/providers";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{
        headerShown: false
      }}/>
    </ThemeProvider>
  );
}
