import { MenuItem } from "@/components";
import { Link, useSegments } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function Menu() {
  const [, , group] = useSegments();
  console.log(group);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Link
        href={`/${group}/profile`}
        asChild>
        <MenuItem
          title="Profile"
          imageSrc={require("@/assets/images/friends.png")}
        />
      </Link>
      <Link
        href=""
        asChild>
        <MenuItem
          title="Friends"
          imageSrc={require("@/assets/images/friends.png")}
        />
      </Link>
      <Link
        href=""
        asChild>
        <MenuItem
          title="Chats"
          imageSrc={require("@/assets/images/chat.png")}
        />
      </Link>
      <Link
        href=""
        asChild>
        <MenuItem
          title="Settings"
          imageSrc={require("@/assets/images/settings.png")}
        />
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
