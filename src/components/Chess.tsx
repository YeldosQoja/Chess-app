import { useChess } from "@/contexts";
import { ChessBoard } from "./ChessBoard";
import { Pieces } from "./Pieces";
import { View } from "react-native";

export const Chess = () => {
  const { pieces } = useChess();
  return (
    <View>
      <ChessBoard />
      <Pieces pieces={pieces} />
    </View>
  );
};
