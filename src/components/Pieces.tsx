import React from "react";
import { Piece } from "@/models";
import { ChessPiece } from "./ChessPiece";
import { encodeSquare } from "@/utils/encodeSquare";
import { useChess } from "@/contexts";

type Props = {
  pieces: Piece[];
};

export const Pieces = ({ pieces }: Props) => {
  const { pieceRefs } = useChess();
  return (
    <>
      {pieces.map((p) => (
        <ChessPiece
          key={p.id}
          ref={pieceRefs?.current?.[encodeSquare(p.square)]}
          piece={p}
        />
      ))}
    </>
  );
};
