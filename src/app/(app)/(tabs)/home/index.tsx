import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Link, useSegments } from "expo-router";
import { GameArchiveItem, GameCard, Button } from "@/components";
import { useAppTheme } from "@/contexts";
import { useHome } from "@/queries/home";

const BUTTON_HEIGHT = 50;
const MARGIN = 12;

export default function Home() {
  const { colors } = useAppTheme();
  const [, , group] = useSegments();
  const { data, isError, isSuccess } = useHome();

  if (isError || !isSuccess) {
    return null;
  }

  const { latestGame, games } = data;

  return (
    <View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.cardsContainer}>
          {latestGame && (
            <GameCard title="Recommended Game" opponent={latestGame.white} />
          )}
          {latestGame && (
            <GameCard title="Latest Game" opponent={latestGame.white} />
          )}
        </View>
        {games.length ? (
          <>
            <Text style={[styles.title, { color: colors.text }]}>
              Recent games
            </Text>
            {games.map((game) => (
              <GameArchiveItem key={game.id} game={game} />
            ))}
          </>
        ) : null}
      </ScrollView>
      <Link href={`/${group}/friends`} asChild>
        <Button mode="contained" style={styles.button}>
          Play
        </Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  content: {
    paddingBottom: BUTTON_HEIGHT + MARGIN,
  },
  cardsContainer: {
    margin: MARGIN,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    marginHorizontal: MARGIN,
  },
  button: {
    position: "absolute",
    left: MARGIN,
    bottom: MARGIN,
    right: MARGIN,
  },
});
