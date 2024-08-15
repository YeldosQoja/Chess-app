import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Chess } from "@/components";
import { useAppTheme } from "@/providers";
import { useGetGameById } from "@/queries/games";
import { useProfile } from "@/queries/profile";

export default function Game() {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id ? parseInt(params.id) : 0;
  const {
    data,
    isPending: isLoadingGame,
    isSuccess: isSuccessGame,
  } = useGetGameById(id);
  const {
    data: profile,
    isPending: isLoadingProfile,
    isSuccess: isSuccessProfile,
  } = useProfile();

  if (
    isLoadingGame ||
    !isSuccessGame ||
    isLoadingProfile ||
    !isSuccessProfile
  ) {
    return null;
  }

  const { isWhite, opponent } = data;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Chess player={isWhite ? "white" : "black"}>
        <Chess.ProfileCard
          profile={opponent}
          isWhite={!isWhite}
        />
        <Chess.Board />
        <Chess.PromotionPicker />
        <Chess.ProfileCard
          profile={profile}
          isWhite={isWhite}
        />
      </Chess>
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
