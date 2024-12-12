import { Dimensions } from "react-native";

export const COLORS = {
  light: "rgb(234,240,206)",
  dark: "rgb(187,190,100)",
};
const { width } = Dimensions.get("window");
export const SQUARE_SIZE = width / 8;
