import { Square } from "@/models";

export const isSameSquare = (square1: Square, square2: Square) => {
  return square1[0] === square2[0] && square1[1] === square2[1];
};

export const includesSquare = (moves: Square[], target: Square) => {
    return moves.some(m => isSameSquare(m, target));
}
