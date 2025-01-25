import { useCallback } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "@/contexts";
import { User } from "@/models";
import { useSendChallenge } from "@/queries/games";

type Props = {
  title: string;
  opponent: User;
  onPress?: () => void;
};

export const GameCard = ({ title, opponent, onPress }: Props) => {
  const { colors } = useAppTheme();
  const { mutate: sendChallenge } = useSendChallenge();

  const handlePress = useCallback(() => {
    onPress && onPress();
    Alert.alert(
      "Send Challenge",
      `Do you want to send a challenge to ${opponent.username}?`,
      [
        {
          text: "Yes",
          isPreferred: true,
          onPress: () => {
            sendChallenge(opponent.username);
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  }, [onPress, opponent.username, sendChallenge]);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={handlePress}
    >
      <Image
        source={require("@/../assets/images/chessboard.png")}
        style={[styles.image, { borderColor: colors.icon }]}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={(styles.playerName, { color: colors.text })}>
          {`${opponent.firstName} ${opponent.lastName}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 18,
    padding: 8,
    borderRadius: 16,
  },
  image: {
    width: 140,
    height: 140,
    borderWidth: 1.5,
    borderRadius: 12,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "center",
    margin: 12,
  },
  playerName: {
    fontSize: 15,
  },
});
