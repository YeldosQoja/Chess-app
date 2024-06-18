import {
  ArchiveListHeader,
  ArchiveListItem,
  Button,
  GameCard,
  ScreenContainer,
} from "@/components";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();
  const renderGameListItem = () => {
    return (
      <ArchiveListItem
        time="8:45"
        playerName="Bronn White"
        status="Won"
      />
    );
  };

  return (
    <ScreenContainer>
      <FlatList
        data={Array(5).fill(null)}
        renderItem={renderGameListItem}
        ListHeaderComponent={
          <View>
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
            <Text style={styles.title}>Recent games</Text>
            <ArchiveListHeader />
          </View>
        }
      />
      <Button
        title="Play"
        onPress={() => router.push("game/10")}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "500",
  },
});
