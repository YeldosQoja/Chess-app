import { useAppTheme } from "@/providers";
import { StyleSheet, Text, View } from "react-native";

type GameStatsProps = {
  draws: number;
  losses: number;
  wins: number;
};

export const GameStats = ({ draws, losses, wins }: GameStatsProps) => {
  const { colors } = useAppTheme();
  return (
    <View style={styles.container}>
      <View
        style={[styles.stats, { backgroundColor: colors.card, width: "30%" }]}>
        <Text style={[styles.title, { color: colors.green }]}>Wins</Text>
        <Text style={[styles.data, { color: colors.text }]}>{wins}</Text>
      </View>
      <View
        style={[styles.stats, { backgroundColor: colors.card, width: "30%" }]}>
        <Text style={[styles.title, { color: colors.yellow }]}>Draws</Text>
        <Text style={[styles.data, { color: colors.text }]}>{draws}</Text>
      </View>
      <View
        style={[styles.stats, { backgroundColor: colors.card, width: "30%" }]}>
        <Text style={[styles.title, { color: colors.red }]}>Losses</Text>
        <Text style={[styles.data, { color: colors.text }]}>{losses}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 12,
    marginVertical: 16,
  },
  stats: {
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
  },
  data: {
    fontSize: 14,
    fontWeight: "500",
  },
});
