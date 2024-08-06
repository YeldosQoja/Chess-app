import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Chess, PlayerProfileCard } from "@/components";
import { useAppTheme } from "@/providers";
import { useGetGameById } from "@/queries/games";

export default function Game() {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id ? parseInt(params.id) : 0;
  const { data, isPending, isSuccess } = useGetGameById(id);

  if (isPending || !isSuccess) {
    return null;
  }

  const { isWhite, opponent, challenger } = data;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PlayerProfileCard
        player={isWhite ? opponent : challenger}
        isWhite={!isWhite}
      />
      <Chess player={{ isWhite }}>
        <Chess.Board />
        <Chess.PromotionPicker />
      </Chess>
      <PlayerProfileCard
        player={isWhite ? challenger : opponent}
        isWhite={isWhite}
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
