import { useTheme } from "@/hooks";
import { StyleSheet, Text, View } from "react-native";

export const ArchiveListHeader = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.tint }]}>Time</Text>
      <Text style={[styles.heading, { color: colors.tint }]}>Opponent</Text>
      <Text style={[styles.heading, { color: colors.tint }]}>Status</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 12,
  },
  heading: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
});
