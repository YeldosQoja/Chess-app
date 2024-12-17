import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { Button } from "./Button";
import { FriendRequest as FriendRequestModel } from "@/models";
import { useAppTheme } from "@/providers";
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
} from "@/queries/friends";

type FriendRequestProps = {
  request: FriendRequestModel;
};

export const FriendRequest = ({
  request: {
    id,
    sender: { firstName, lastName, avatar },
    createdAt,
  },
}: FriendRequestProps) => {
  const { colors } = useAppTheme();

  const { mutate: accept } = useAcceptFriendRequest();
  const { mutate: decline } = useDeclineFriendRequest();

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar.Image size={32} source={{ uri: avatar }} />
        <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
        <Text style={styles.date}>{createdAt.toLocaleDateString()}</Text>
      </View>
      <View style={styles.buttonsRow}>
        <Button
          mode="outlined"
          style={[styles.button, { borderColor: colors.tint }]}
          onPress={() => {
            decline(id);
          }}
        >
          Decline
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => {
            accept(id);
          }}
        >
          Accept
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 12,
    borderBottomWidth: 0.5,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    height: undefined,
    width: "48%",
  },
  date: {
    fontSize: 12,
  },
});
