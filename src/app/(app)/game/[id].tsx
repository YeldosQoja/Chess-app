import { Alert, View } from "react-native";
import "react-native-get-random-values";
import { useEffect, useState } from "react";
import { useChess } from "@/hooks";
import { IPiece, IStrategy, PieceType } from "@/models";
import { Chessboard, ChessPiece, PromotionPicker } from "@/components";
import { Stack } from "expo-router";

export default function Game() {
  const game = useChess();
  const { board, white, black } = game;
  const [selectedPiece, setSelectedPiece] = useState<IPiece | null>(null);
  const validMoves = selectedPiece ? selectedPiece.getValidMoves() : [];
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);

  const handleSelectSquare = (square: [number, number]) => {
    const [rank, file] = square;
    const piece = board[rank][file];
    if (selectedPiece === null && piece === null) {
      return;
    }
    if (piece && game.canSelect(piece)) {
      setSelectedPiece(piece);
      game.selectPiece(piece);
    } else if (
      selectedPiece &&
      selectedPiece
        .getValidMoves()
        .some(([moveRank, moveFile]) => moveRank === rank && moveFile === file)
    ) {
      game.move(square);
      if (
        selectedPiece.getType() === PieceType.Pawn &&
        (rank === 0 || rank === 7)
      ) {
        setPromotionModalOpen(true);
      } else {
        setSelectedPiece(null);
      }
    }
  };

  const handleSelectPromotion = ({ strategy }: { strategy: IStrategy }) => {
    selectedPiece?.updateStrategy(strategy);
    setSelectedPiece(null);
    setPromotionModalOpen(false);
  };

  useEffect(() => {
    if (game.isInCheckmate()) {
      Alert.alert("Checkmate", `${game.getWinner()} won!`);
    }
  }, [game.isInCheckmate()]);

  useEffect(() => {
    if (game.isInStalemate()) {
      Alert.alert("Stalemate", "Draw!");
    }
  }, [game.isInStalemate()]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Stack.Screen
        options={{
          title: "",
          headerBackTitleVisible: false,
        }}
      />
      <Chessboard
        board={board}
        onSelect={handleSelectSquare}
        validMoves={validMoves}>
        {white.pieces
          .filter((p) => !p.isCaptured)
          .map((piece) => (
            <ChessPiece
              key={piece.id}
              piece={piece}
              selected={selectedPiece === piece}
              onSelect={handleSelectSquare}
            />
          ))}
        {black.pieces
          .filter((p) => !p.isCaptured)
          .map((piece) => (
            <ChessPiece
              key={piece.id}
              piece={piece}
              selected={selectedPiece === piece}
              onSelect={handleSelectSquare}
            />
          ))}
      </Chessboard>
      <PromotionPicker
        open={promotionModalOpen}
        game={game}
        isWhite={selectedPiece?.owner === game.white}
        onSelect={handleSelectPromotion}
      />
    </View>
  );
}
