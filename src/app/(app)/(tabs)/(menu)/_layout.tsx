import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="menu"
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="profile"
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
