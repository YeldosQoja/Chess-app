import { Button, GameCard, ScreenContainer } from "@/components";
import { useAppTheme } from "@/hooks";
import { Link, useSegments } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { DataTable } from "react-native-paper";

export default function Home() {
  const [, , group] = useSegments();
  const { colors } = useAppTheme();
  const [items] = useState([
    {
      time: "8:45",
      opponent: "Scarlett Willis",
      status: "Won",
    },
    {
      time: "5:45",
      opponent: "Margaret Kelley",
      status: "Lost",
    },
    {
      time: "6:20",
      opponent: "Aryan Giles",
      status: "Draw",
    },
  ]);

  return (
    <ScreenContainer>
      <ScrollView>
        <GameCard
          title="Recommended Game"
          playerName="Adriano Costa"
          onPress={() => null}
        />
        <GameCard
          title="Latest Game"
          playerName="Sam Parker"
          onPress={() => null}
        />
        <Text style={[styles.title, { color: colors.text }]}>Recent games</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Time</DataTable.Title>
            <DataTable.Title>Opponent</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
          </DataTable.Header>
          {items.map(({ time, opponent, status }, idx) => (
            <DataTable.Row key={idx}>
              <DataTable.Cell>{time}</DataTable.Cell>
              <DataTable.Cell>{opponent}</DataTable.Cell>
              <DataTable.Cell
                textStyle={{
                  color:
                    status === "Won"
                      ? colors.green
                      : status === "Draw"
                      ? colors.yellow
                      : status === "Lost"
                      ? colors.red
                      : undefined,
                  fontWeight: "600",
                }}>
                {status}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
      <Link
        href={`/${group}/profile`}
        asChild>
        <Button
          title="Play"
          style={{ position: "absolute", left: 12, bottom: 12, right: 12 }}
        />
      </Link>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "500",
  },
});
