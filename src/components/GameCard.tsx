import { useTheme } from "@/hooks";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  playerName: string;
  onPress: () => void;
};

export const GameCard = ({ title, playerName, onPress }: Props) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}>
      <Image
        source={require("@/assets/images/chessboard.png")}
        style={[styles.image, { borderColor: colors.icon }]}
      />
      <View
        style={{
          flex: 1,
        }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.playerName}>{playerName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 18,
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
