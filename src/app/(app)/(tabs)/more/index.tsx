import { Avatar } from "@/components/Avatar";
import { useTheme } from "@/hooks";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function More() {
  const { colors } = useTheme();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={[
          styles.item,
          { borderColor: colors.border, borderBottomWidth: 1 },
        ]}>
        <Avatar size={32} />
        <Text style={styles.itemTitle}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.item,
          { borderColor: colors.border, borderBottomWidth: 1 },
        ]}>
        <Image
          style={styles.image}
          source={require("@/assets/images/friends.png")}
        />
        <Text style={styles.itemTitle}>Friends</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.item,
          { borderColor: colors.border, borderBottomWidth: 1 },
        ]}>
        <Image
          style={styles.image}
          source={require("@/assets/images/chat.png")}
        />
        <Text style={styles.itemTitle}>Chats</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.item,
          { borderColor: colors.border, borderBottomWidth: 1 },
        ]}>
        <Image
          style={styles.image}
          source={require("@/assets/images/settings.png")}
        />
        <Text style={styles.itemTitle}>Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  itemTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 16,
  },
  image: {
    width: 32,
    height: 32,
  },
});
