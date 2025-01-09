import { SQUARE_SIZE } from "@/constants/board";
import { Square } from "@/models";

type Position = {
  x: number;
  y: number;
};

export const toPosition = (square: Square, rotated: boolean): Position => {
  "worklet";
  const [y, x] = square;
  if (!rotated) {
    return { x: x * SQUARE_SIZE, y: y * SQUARE_SIZE };
  }
  return { x: (7 - x) * SQUARE_SIZE, y: (7 - y) * SQUARE_SIZE };
};
