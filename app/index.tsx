import { View } from "react-native";
import { Chessboard } from "./components/Chessboard";
import { useChess } from "./hooks/useChess";

export default function Index() {
  const game = useChess();
  game.startGame();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Chessboard game={game}/>
    </View>
  );
}
