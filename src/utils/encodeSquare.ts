import { Square } from "@/models";

export const encodeSquare = (square: Square) => {
  const [y, x] = square;
  const rank = String.fromCharCode("a".charCodeAt(0) + x);
  const file = `${8 - y}`;
  return rank + file;
};

export const decodeSquare = (str: string): Square => {
  const [rank, file] = str.split("");
  const y = 8 - parseInt(file);
  const x = rank.charCodeAt(0) - "a".charCodeAt(0);
  return [y, x];
};
