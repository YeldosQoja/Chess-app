import { User } from "@/models";
import { useAppTheme } from "@/providers";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";

type Props = {
  player: User;
  isWhite: boolean;
};

export const PlayerProfileCard = ({
  player: { avatar, firstName, lastName },
  isWhite,
}: Props) => {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Avatar.Image
        source={{ uri: avatar }}
        size={40}
      />
      <Text
        style={[
          styles.name,
          { color: colors.text },
        ]}>{`${firstName} ${lastName}`}</Text>
      <View
        style={[
          styles.timer,
          {
            backgroundColor: isWhite ? "#282828" : "#e8e8e8",
          },
        ]}>
        <Text
          style={[
            styles.timerText,
            { color: isWhite ? "#e8e8e8" : "#282828" },
          ]}>
          4:34
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    padding: 12,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 6,
  },
  timer: {
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontVariant: ["tabular-nums"],
  },
  timerText: {
    fontSize: 17,
    fontWeight: "500",
  },
});
