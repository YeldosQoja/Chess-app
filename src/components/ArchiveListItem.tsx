import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  time: string;
  playerName: string;
  status: "Won" | "Lost" | "Draw";
};

export const ArchiveListItem = ({ time, playerName, status }: Props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.data}>{time}</Text>
      <Text style={styles.data}>{playerName}</Text>
      <Text
        style={[
          styles.data,
          {
            color:
              status === "Won" ? "green" : status === "Lost" ? "red" : "orange",
          },
        ]}>
        Won
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  data: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
});
