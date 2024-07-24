import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { Avatar, Button, Divider } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "@/providers";
import { useSendChallenge } from "@/queries/game";
import { User } from "@/models";

type Props = {
  user: User;
};

export const FriendItem = ({ user: { id, firstName, lastName, avatar } }: Props) => {
  const { colors } = useAppTheme();
  const { mutate: sendChallenge } = useSendChallenge();

  const onChallenge = () => {
    sendChallenge(id);
  };

  return (
    <Link
      href={`/users/${id}`}
      asChild>
      <TouchableOpacity>
        <View style={styles.content}>
          <Avatar.Image
            size={38}
            source={{ uri: avatar }}
          />
          <Text
            style={[
              styles.name,
              { color: colors.text },
            ]}>{`${firstName} ${lastName}`}</Text>
          <Link
            href={`/chats/${id}`}
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
          <Button
            textColor={colors.tint}
            onPress={onChallenge}>
            Challenge
          </Button>
        </View>
        <Divider />
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    marginHorizontal: 12,
  },
  messageIcon: {
    marginRight: 0,
  },
});
