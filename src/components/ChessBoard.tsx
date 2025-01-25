import { View, StyleSheet, Dimensions, Text } from "react-native";
import { COLORS, SQUARE_SIZE } from "@/constants/board";
import { useChess } from "@/contexts";

const { width } = Dimensions.get("window");

export const ChessBoard = () => {
  const { color } = useChess();
  const flip = color === "black";
  return (
    <View style={[styles.board]}>
      {Array(8)
        .fill(null)
        .map((_, i) => {
          const isEvenRank = i % 2 === 0;
          const colors = [
            isEvenRank ? COLORS.light : COLORS.dark,
            isEvenRank ? COLORS.dark : COLORS.light,
          ];
          return (
            <View key={i} style={styles.row}>
              {Array(8)
                .fill(null)
                .map((_, j) => (
                  <View
                    key={j}
                    style={{
                      backgroundColor: colors[j % 2],
                      ...styles.square,
                    }}
                  >
                    {j === 0 ? (
                      <Text
                        style={[styles.rank, { color: colors[(j + 1) % 2] }]}
                      >
                        {flip ? i + 1 : 8 - i}
                      </Text>
                    ) : null}
                    {i === 7 ? (
                      <Text
                        style={[styles.file, { color: colors[(j + 1) % 2] }]}
                      >
                        {flip
                          ? String.fromCharCode("h".charCodeAt(0) - j)
                          : String.fromCharCode("a".charCodeAt(0) + j)}
                      </Text>
                    ) : null}
                  </View>
                ))}
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width,
    aspectRatio: 1,
  },
  row: {
    width: "100%",
    flexDirection: "row",
  },
  square: {
    width: SQUARE_SIZE,
    aspectRatio: 1,
  },
  rank: {
    fontSize: 12,
    fontWeight: "500",
    position: "absolute",
    left: 4,
    top: 4,
  },
  file: {
    fontSize: 12,
    fontWeight: "500",
    position: "absolute",
    right: 4,
    bottom: 4,
  },
  moveButton: {
    position: "absolute",
    zIndex: 1,
  },
  dot: {
    backgroundColor: "rgba(0.0, 0.0, 0.0, 0.2)",
    width: "30%",
    aspectRatio: 1,
    borderRadius: 100,
  },
});
