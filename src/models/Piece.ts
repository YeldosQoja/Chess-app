import { PieceType } from "./PieceType";
import { Square } from "./Square";

export type Piece = {
  id: number;
  type: PieceType;
  color: "white" | "black";
  square: Square;
};
