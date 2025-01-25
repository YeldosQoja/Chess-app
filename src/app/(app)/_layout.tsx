import { Stack } from "expo-router";
import { WebsocketProvider } from "@/contexts";
import { Platform } from "react-native";
import { Header } from "@/components";

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
            header: Platform.OS === "android" ? Header : undefined,
            headerBackTitleVisible: false,
          }}
        />
      </Stack>
    </WebsocketProvider>
  );
}
