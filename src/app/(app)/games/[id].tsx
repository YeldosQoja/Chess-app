import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Chess, IChess, IPiece, IStrategy, Square } from "@/models";
import { Chessboard, PromotionPicker } from "@/components";
import { useWebsocket } from "@/providers";
import { sendMove, useGetGameById } from "@/queries/games";
import { useMutation } from "@tanstack/react-query";

export default function Game() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id ? parseInt(params.id) : 0;

  const { ws } = useWebsocket();

  const gameRef = useRef<IChess>(null);
  const game = useMemo(() => {
    if (gameRef.current === null) {
      gameRef.current = new Chess();
    }
    return gameRef.current;
  }, []);

  const [selectedPiece, setSelectedPiece] = useState<IPiece | null>(null);
  const [board, setBoard] = useState(game.board);

  const [promotionModalOpen, setPromotionModalOpen] = useState(false);

  const { data, isPending } = useGetGameById(id);
  const { mutate } = useMutation({
    mutationFn: sendMove,
    onSuccess: (data, { move: { to } }) => {
      console.log("onSuccess", data);
      if (selectedPiece !== null) {
        game.move(selectedPiece, to);
        setBoard(game.board);
        setSelectedPiece(null);
      }
    },
  });

  useEffect(() => {
    ws!.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "move") {
        const { from, to } = data;
        const [rank, file] = from as Square;
        const piece = game.board[rank][file] as IPiece;
        game.move(piece, to);
        setBoard(game.board);
      }
    };
  }, []);

  const handleMove = (square: Square) => {
    if (selectedPiece !== null) {
      mutate({ id, move: { from: selectedPiece.currentSquare, to: square } });
    }
  };

  const handleSelectPromotion = ({ strategy }: { strategy: IStrategy }) => {
    selectedPiece?.updateStrategy(strategy);
    setSelectedPiece(null);
    setPromotionModalOpen(false);
  };

  if (isPending) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Chessboard
        game={game}
        isWhite={data.is_white}
        selectedPiece={selectedPiece}
        onSelectPiece={setSelectedPiece}
        onMove={handleMove}
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
