import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { Avatar, Button, Divider } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "@/providers";


type Props = {
  friendId: string | number;
  fullName: string;
  onChallenge: () => void;
};

export const FriendListItem = ({ friendId, fullName }: Props) => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Avatar.Image
          size={45}
          source={{ uri: "1" }}
        />
        <Text style={[styles.fullName, { color: colors.text }]}>
          {fullName}
        </Text>
        <Link
          href={`/chats/${friendId}`}
          asChild>
          <Ionicons.Button
            name="mail-outline"
            size={24}
            color={colors.icon}
            iconStyle={styles.messageIcon}
            backgroundColor="transparent"
            onPress={() => console.log("Message pressed")}
            underlayColor="transparent"
          />
        </Link>
        <Button textColor={colors.tint}>Challenge</Button>
      </View>
      <Divider />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  fullName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    marginHorizontal: 12,
  },
  messageIcon: {
    marginRight: 0,
  },
});
