import type { Piece } from "@/models";
import { PieceType } from "../models/PieceType";

export function generatePieceListFromFEN(fen: string) {
  const pieces: Piece[] = [];
  fen.split("/").forEach((row, i) => {
    let spaces = 0;
    row.split("").forEach((p, j) => {
      if (isNaN(parseInt(p))) {
        pieces.push({
          id: pieces.length + 1,
          type: p.toLowerCase() as PieceType,
          color: p.charCodeAt(0) > 90 ? "black" : "white",
          square: [i, spaces],
        });
        spaces += 1;
      } else {
        spaces += parseInt(p);
      }
    });
  });
  return pieces;
}
