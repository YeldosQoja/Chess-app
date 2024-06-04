import { View } from "react-native";
import { Chessboard } from "./components/Chessboard";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Chessboard />
    </View>
  );
}
