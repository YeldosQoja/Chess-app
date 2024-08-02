import React, { PropsWithChildren } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { ChessPiece } from "./ChessPiece";
import { IChess, IPiece, Square } from "@/models";

interface Props {
  game: IChess;
  isWhite: boolean;
  selectedPiece: IPiece | null;
  onSelectPiece: (piece: IPiece) => void;
  onMove: (square: Square) => void;
}

const COLORS = {
  light: "rgb(234,240,206)",
  dark: "rgb(187,190,100)",
};

const { width } = Dimensions.get("screen");
const SQUARE_SIZE = width / 8;

export const Chessboard = ({
  game,
  isWhite,
  selectedPiece,
  onSelectPiece,
  onMove,
}: PropsWithChildren<Props>) => {
  const { board, white, black, activePlayer } = game;
  return (
    <View
      style={[
        styles.board,
        { transform: [{ rotate: isWhite ? "0deg" : "180deg" }] },
      ]}>
      {/* Tiles */}
      {board.map((row, rank) => {
        const isEvenRank = rank % 2 === 0;
        const colors = [
          isEvenRank ? COLORS.light : COLORS.dark,
          isEvenRank ? COLORS.dark : COLORS.light,
        ];
        return (
          <View
            key={rank}
            style={styles.row}>
            {row.map((_, file) => (
              <View
                key={file}
                style={[
                  styles.square,
                  {
                    backgroundColor: colors[file % 2],
                  },
                ]}
              />
            ))}
          </View>
        );
      })}
      {/* Valid moves */}
      {selectedPiece &&
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
            ]}>
            <View style={styles.dot} />
          </View>
        ))}
      {/* White pieces */}
      {white.pieces
        .filter((p) => !p.isCaptured)
        .map((piece) => (
          <ChessPiece
            key={piece.id}
            isWhite={isWhite}
            piece={piece}
            active={activePlayer === piece.owner}
            selected={selectedPiece?.id === piece.id}
            onSelect={onSelectPiece}
          />
        ))}
      {/* Black pieces */}
      {black.pieces
        .filter((p) => !p.isCaptured)
        .map((piece) => (
          <ChessPiece
            key={piece.id}
            isWhite={isWhite}
            piece={piece}
            active={activePlayer === piece.owner}
            selected={selectedPiece?.id === piece.id}
            onSelect={onSelectPiece}
          />
        ))}
      {/* Moves */}
      <View style={StyleSheet.absoluteFill}>
        {board.map((row, rank) => (
          <View
            key={rank}
            style={styles.row}>
            {row.map((_, file) => (
              <TouchableOpacity
                key={file}
                style={styles.square}
                onPress={() => onMove([rank, file])}
              />
            ))}
          </View>
        ))}
      </View>
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
