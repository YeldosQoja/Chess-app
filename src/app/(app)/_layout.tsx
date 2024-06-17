import { useTheme } from "@/hooks";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { useState } from "react";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function AppLayout() {
  const { colors, dark } = useTheme();
  const [isAuth] = useState(true);

  if (!isAuth) {
    console.log("Redirecting to the url /sign-in");
    return <Redirect href="/sign-in" />;
  }

  return (
    <NavigationThemeProvider
      value={{
        dark,
        colors: {
          ...colors,
          primary: colors.tint,
          card: colors.background,
          notification: colors.tabIconDefault,
        },
      }}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="index" />
      </Stack>
    </NavigationThemeProvider>
  );
}
