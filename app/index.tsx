import { View } from "react-native";
import { Chessboard } from "./components/Chessboard";
import { useChess } from "./hooks/useChess";
import "react-native-get-random-values";

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
