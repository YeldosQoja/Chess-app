import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="menu"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
}
