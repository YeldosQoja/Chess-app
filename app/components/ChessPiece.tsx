import { StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Piece, PieceType } from "../hooks/Piece";
import images from "../assets/images/chess";
import lodash from "lodash";

type Props = {
  piece: Piece;
  onSelect: (square: [number, number]) => void;
  selected: boolean;
};

export const ChessPiece = ({ piece, onSelect, selected }: Props) => {
  const [rank, file] = piece.currentSquare;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.container,
        {
          top: `${(100 / 8) * rank}%`,
          left: `${(100 / 8) * file}%`,
        },
        selected && {
          backgroundColor: "yellow",
        },
      ]}
      onPress={() => void onSelect(piece.currentSquare)}>
      <Image
        source={lodash.get(
          images,
          `${piece.strategy.type as PieceType}.${
            piece.isWhite ? "white" : "black"
          }`
        )}
        style={styles.image}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: `${100 / 8}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "70%",
    aspectRatio: 1,
  },
});
