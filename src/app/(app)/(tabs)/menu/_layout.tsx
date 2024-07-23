import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen name="friends" options={{
        headerTitle: "Friends"
      }}/>
    </Stack>
  );
}
