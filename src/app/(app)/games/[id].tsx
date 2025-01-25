import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Chess, GameResultModal } from "@/components";
import {
  ChessProvider,
  ChessRef,
  useAppTheme,
  PromotionPickerProvider,
} from "@/contexts";
import {
  useFinishGame,
  useGetGameById,
  useMakeMove,
  useValidateMove,
  useValidMoves,
} from "@/queries/games";
import { GameSocketService } from "@/services/SocketService";
import { useLazy } from "@/hooks/useLazy";
import { Square, Move } from "@/models";
import { encodeSquare } from "@/utils/encodeSquare";

export default function Game() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const chessRef = useRef<ChessRef>(null);
  const { data: game, isSuccess: isSuccessGame } = useGetGameById(id as string);
  const { data: validMoves } = useValidMoves(
    id as string,
    selectedSquare ? encodeSquare(selectedSquare) : null,
  );
  const validateMove = useValidateMove();
  const makeMove = useMakeMove();
  const finishGame = useFinishGame();
  const socketService = useLazy(
    () =>
      new GameSocketService(
        `${process.env.EXPO_PUBLIC_WS_URL}games/room-${id}/`,
      ),
  );

  const [resultModalOpen, setResultModalOpen] = useState(false);

  useEffect(() => {
    socketService.onMove(({ from, to, promotion }) => {
      chessRef.current?.move({ from, to }, promotion);
    });
    return socketService.close;
  }, [socketService]);

  const validate = async (move: Move) => {
    const { is_valid } = await validateMove.mutateAsync({
      id: id as string,
      ...move,
    });
    return is_valid;
  };

  const handleMove = useCallback(
    (move: Move) => {
      makeMove.mutate({
        id: id as string,
        ...move,
        timestamp: new Date(),
      });
    },
    [id, makeMove],
  );

  const handleCloseResultModal = useCallback(() => {
    router.back();
    setResultModalOpen(false);
  }, [router]);

  if (!isSuccessGame) {
    return null;
  }

  const { white, black, color, turn, board, winner } = game;

  // const whitePlayerCard = (
  //   <ChessPlayerCard
  //     color={color}
  //     time={600}
  //     firstName={white.firstName}
  //     lastName={white.lastName}
  //     avatar={white.avatar}
  //   />
  // );

  // const blackPlayerCard = (
  //   <ChessPlayerCard
  //     color={color}
  //     time={600}
  //     firstName={black.firstName}
  //     lastName={black.lastName}
  //     avatar={black.avatar}
  //   />
  // );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* {color === "white" ? blackPlayerCard : whitePlayerCard} */}
      <PromotionPickerProvider color={color}>
        <ChessProvider
          ref={chessRef}
          color={color}
          turn={turn}
          board={board}
          validateMove={validate}
          onMove={handleMove}
        >
          <Chess />
        </ChessProvider>
      </PromotionPickerProvider>
      {/* {color === "white" ? whitePlayerCard : blackPlayerCard} */}
      <GameResultModal
        open={resultModalOpen}
        color={color}
        winner={winner}
        white={white}
        black={black}
        onClose={handleCloseResultModal}
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
