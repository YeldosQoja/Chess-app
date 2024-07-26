import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Chess, IPiece, IStrategy, Square } from "@/models";
import { Chessboard, PromotionPicker } from "@/components";
import { useWebsocket } from "@/providers";
import { includesSquare } from "@/utils/isSameSquare";

export default function Game() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ws } = useWebsocket();

  const [game, setGame] = useState(new Chess());
  const [selectedPiece, setSelectedPiece] = useState<IPiece | null>(null);

  const [promotionModalOpen, setPromotionModalOpen] = useState(false);

  useEffect(() => {
    ws?.addEventListener("message", (e) => {
      console.log("message", e);
    });
  }, []);

  const handleSelectMove = (square: Square) => {
    if (selectedPiece === null) return;
    if (!includesSquare(selectedPiece.getValidMoves(), square)) return;
    game.move(square);
    setSelectedPiece(null);
  };

  const handleSelectPiece = (piece: IPiece) => {
    game.selectPiece(piece);
    setSelectedPiece(piece);
  };

  const handleSelectPromotion = ({ strategy }: { strategy: IStrategy }) => {
    selectedPiece?.updateStrategy(strategy);
    setSelectedPiece(null);
    setPromotionModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <Chessboard
        game={game}
        selectedPiece={selectedPiece}
        onSelectPiece={handleSelectPiece}
        onSelectMove={handleSelectMove}
      />
      <PromotionPicker
        open={promotionModalOpen}
        game={game}
        isWhite={selectedPiece?.isWhite ?? false}
        onSelect={handleSelectPromotion}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
