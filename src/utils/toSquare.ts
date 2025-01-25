import { Dimensions } from "react-native";
import { Square } from "@/models";

const { width } = Dimensions.get("window");
const SQUARE_SIZE = width / 8;

type Position = {
  x: number;
  y: number;
};

export const toSquare = ({ x, y }: Position, rotated: boolean): Square => {
  "worklet";
  const centerX = x + SQUARE_SIZE / 2;
  const centerY = y + SQUARE_SIZE / 2;
  const i = Math.floor(centerY / SQUARE_SIZE);
  const j = Math.floor(centerX / SQUARE_SIZE);
  if (!rotated) {
    return [i, j];
  }
  return [7 - i, 7 - j];
};
