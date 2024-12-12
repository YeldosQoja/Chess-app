import { useContext } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { ChessContext } from "@/providers";
import { ChessPiece } from "./ChessPiece";
import { COLORS, SQUARE_SIZE } from "@/constants/board";

const { width } = Dimensions.get("window");

export const ChessBoard = () => {
  const { selectedPiece, player, white, black, gameState, move } =
    useContext(ChessContext);

  const { board } = gameState;
  const flip = player === "black";

  return (
    <View
      style={[
        styles.board,
        { transform: [{ rotate: flip ? "180deg" : "0deg" }] },
      ]}
    >
      {/* Tiles */}
      {board.map((row, rank) => {
        const isEvenRank = rank % 2 === 0;
        const colors = [
          isEvenRank ? COLORS.light : COLORS.dark,
          isEvenRank ? COLORS.dark : COLORS.light,
        ];
        return (
          <View key={rank} style={styles.row}>
            {row.map((_, file) => (
              <View
                key={file}
                style={{
                  backgroundColor: colors[file % 2],
                  ...styles.square,
                }}
              />
            ))}
          </View>
        );
      })}
      {/* Valid move markers */}
      {selectedPiece !== null &&
        selectedPiece.getValidMoves().map(([rank, file]) => (
          <View
            key={"" + rank + file}
            style={[
              {
                position: "absolute",
                top: SQUARE_SIZE * rank,
                left: SQUARE_SIZE * file,
              },
              styles.square,
            ]}
          >
            <View style={styles.dot} />
          </View>
        ))}
      {white !== null &&
        white.pieces
          .filter((p) => !p.isCaptured)
          .map((piece) => <ChessPiece key={piece.id} piece={piece} />)}
      {black &&
        black.pieces
          .filter((p) => !p.isCaptured)
          .map((piece) => <ChessPiece key={piece.id} piece={piece} />)}
      {/* Moves */}
      {selectedPiece !== null &&
        selectedPiece.getValidMoves().map(([rank, file]) => (
          <TouchableOpacity
            key={"" + rank + file}
            style={[
              styles.square,
              styles.moveButton,
              {
                top: SQUARE_SIZE * rank,
                left: SQUARE_SIZE * file,
              },
            ]}
            onPress={() => move([rank, file])}
          />
        ))}
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
    justifyContent: "center",
    alignItems: "center",
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
