import React, { MutableRefObject } from "react";
import { Move, Piece } from "@/models";
import { ChessBoard } from "./ChessBoard";
import { Pieces } from "./Pieces";
import { ChessPieceRef } from "./ChessPiece";
import { View } from "react-native";

type Props = {
  color: "white" | "black";
  pieces: Piece[];
  pieceRefs: MutableRefObject<Record<
    string,
    MutableRefObject<ChessPieceRef>
  > | null>;
  onMove: (move: Move) => Promise<boolean>;
};

export const Chess = ({ color, pieces, pieceRefs, onMove }: Props) => {
  return (
    <View>
      <ChessBoard color={color} />
      <Pieces
        pieces={pieces}
        pieceRefs={pieceRefs}
        color={color}
        onMove={onMove}
      />
    </View>
  );
};
