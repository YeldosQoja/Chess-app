import { Redirect, Stack } from "expo-router";
import { useState } from "react";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function AppLayout() {
  const [isAuth] = useState(true);

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
