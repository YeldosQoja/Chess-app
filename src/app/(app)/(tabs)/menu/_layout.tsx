import { Platform } from "react-native";
import { Stack } from "expo-router";
import { Header } from "@/components";

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "",
          header: Platform.OS === "android" ? Header : undefined,
        }}
      />
      <Stack.Screen
        name="friends"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
