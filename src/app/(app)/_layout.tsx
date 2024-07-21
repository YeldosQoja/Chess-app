import { Redirect, SplashScreen, Stack } from "expo-router";
import { useAuth } from "@/providers";
import { useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { isAuth, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  if (!isAuth) {
    console.log("Redirecting to the url /sign-in");
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="index" />
      <Stack.Screen name="game/[id]" />
    </Stack>
  );
}
