import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { PropsWithChildren } from "react";
import { Colors } from "../constants/Colors";
import { Board, Square } from "../models";

interface Props {
  board: Board;
  validMoves: Array<Square>;
  onSelect: (square: Square) => void;
}

export const Chessboard = ({
  board,
  validMoves,
  onSelect,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <View>
      <View style={styles.board}>
        {board.map((row, rank) => {
          const isEvenRank = rank % 2 === 0;
          const colors = [
            isEvenRank ? Colors.chessboard.light : Colors.chessboard.dark,
            isEvenRank ? Colors.chessboard.dark : Colors.chessboard.light,
          ];
          return (
            <View
              key={rank}
              style={styles.row}>
              {row.map((_, file) => {
                const isValid = validMoves.some(
                  (s) => s[0] === rank && s[1] === file
                );
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    key={file}
                    style={[
                      styles.square,
                      {
                        backgroundColor: colors[file % 2],
                      },
                    ]}
                    onPress={() => void onSelect([rank, file])}>
                    {isValid && <View style={styles.dot} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: "100%",
    aspectRatio: 1,
  },
  row: {
    width: "100%",
    flexDirection: "row",
  },
  square: {
    width: `${100 / 8}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    backgroundColor: "rgba(0.0, 0.0, 0.0, 0.2)",
    width: "30%",
    aspectRatio: 1,
    borderRadius: 100,
  },
});
