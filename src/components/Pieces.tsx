import React, { MutableRefObject } from "react";
import { Move, Piece } from "@/models";
import { ChessPiece, ChessPieceRef } from "./ChessPiece";
import { encodeSquare } from "@/utils/encodeSquare";

type Props = {
  pieces: Piece[];
  pieceRefs: MutableRefObject<Record<
    string,
    MutableRefObject<ChessPieceRef>
  > | null>;
  color: "white" | "black";
  onMove: (move: Move) => Promise<boolean>;
};

export const Pieces = ({ pieces, pieceRefs, color, onMove }: Props) => {
  return (
    <>
      {pieces.map((p) => (
        <ChessPiece
          key={p.id}
          ref={pieceRefs.current?.[encodeSquare(p.square)]}
          piece={p}
          color={color}
          onMove={onMove}
        />
      ))}
    </>
  );
};
