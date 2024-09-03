import { Stack } from "expo-router";
import { WebsocketProvider } from "@/providers";

export default function AppLayout() {
  return (
    <WebsocketProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="games/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="users/[id]"
          options={{
            headerTitle: "",
            headerBackTitleVisible: false,
          }}
        />
      </Stack>
    </WebsocketProvider>
  );
}
