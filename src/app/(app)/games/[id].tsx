import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChessBoard,
  ChessPiecePromotionPicker,
  ChessPlayerCard,
  GameResultModal,
} from "@/components";
import { ChessProvider, useAppTheme } from "@/providers";
import { useFinishGame, useGetGameById } from "@/queries/games";
import { useProfile } from "@/queries/profile";

export default function Game() {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const id = params.id ? parseInt(params.id) : 0;
  const {
    data: game,
    isPending: isLoadingGame,
    isSuccess: isSuccessGame,
  } = useGetGameById(id);
  const {
    data: profile,
    isPending: isLoadingProfile,
    isSuccess: isSuccessProfile,
  } = useProfile();
  const { mutateAsync: finishGame } = useFinishGame();
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const handleFinish = useCallback(
    async (finishedAt: Date, winner?: "white" | "black") => {
      try {
        const response = await finishGame({ id, finishedAt, winner });
        if (response.status === 200) {
          setResultModalOpen(true);
        }
      } catch (error) {
        console.warn(error);
        Alert.alert("Error while loading the game result.");
      }
    },
    [finishGame, id],
  );

  const handleCloseResultModal = useCallback(() => {
    router.back();
    setResultModalOpen(false);
  }, [router]);

  if (
    isLoadingGame ||
    !isSuccessGame ||
    isLoadingProfile ||
    !isSuccessProfile
  ) {
    return null;
  }

  const { white, black, isWhite, opponent, player, winner, isWinner } = game;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ChessProvider player={player} onFinish={handleFinish}>
        <ChessPlayerCard profile={opponent} isWhite={!isWhite} time={600} />
        <ChessBoard />
        <ChessPiecePromotionPicker />
        <ChessPlayerCard profile={profile} isWhite={isWhite} time={600} />
      </ChessProvider>
      <GameResultModal
        visible={resultModalOpen}
        isWinner={isWinner}
        player={player}
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
