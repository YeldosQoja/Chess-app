import { StyleSheet, Text, View } from "react-native";
import { Game } from "@/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useAppTheme } from "@/contexts";

type GameArchiveItemProps = {
  game: Game;
};

export const GameArchiveItem = ({
  game: { white, black, winner, color },
}: GameArchiveItemProps) => {
  const { colors, dark } = useAppTheme();
  const opponent = color === "white" ? black : white;
  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <Ionicons name="time-outline" size={20} color={colors.icon} />
      <Image source={"pawn_" + color} style={styles.image} />
      <Text
        style={[styles.opponentName, { color: colors.text }]}
      >{`${opponent.firstName} ${opponent.lastName}`}</Text>
      {winner === color ? (
        <Ionicons name="trophy" size={22} color={"#edd900"} />
      ) : dark ? (
        <Ionicons name="flag" size={20} color="white" />
      ) : (
        <Ionicons name="flag-outline" size={20} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
  },
  opponentName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 12,
  },
  image: {
    width: 18,
    height: 18,
    marginLeft: 12,
  },
});
