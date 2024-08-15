import { Square } from "@/models";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const SQUARE_SIZE = width / 8;

type Position = {
  x: number;
  y: number;
};

export const toSquare = ({ x, y }: Position): Square => {
  "worklet";
  const centerX = x + SQUARE_SIZE / 2;
  const centerY = y + SQUARE_SIZE / 2;
  let rank = 0;
  let file = 0;
  for (let i = 0; i < 8; i++) {
    if (i * SQUARE_SIZE < centerY) {
        rank = i;
    }
  }
  for (let i = 0; i < 8; i++) {
    if (i * SQUARE_SIZE < centerX) {
        file = i;
    }
  }
  return [rank, file];
};