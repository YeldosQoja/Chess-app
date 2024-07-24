import { StyleSheet, Text, View } from "react-native";
import { Avatar, DataTable } from "react-native-paper";
import { useAppTheme } from "@/providers";
import {
  useUserById,
  useFriendsByUserId,
  useGamesByUserId,
} from "@/queries/users";
import { useLocalSearchParams } from "expo-router";
import { FriendItem, ScreenContainer } from "@/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function User() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id ? parseInt(params.id) : 0;

  const { data: user, isPending } = useUserById(id);
  const { data: friends } = useFriendsByUserId(id);
  const { data: games } = useGamesByUserId(id);

  const {
    username,
    firstName,
    lastName,
    avatar,
    dateJoined,
    wins,
    losses,
    draws,
  } = user;

  return (
    <ScreenContainer
      scrollable
      isLoading={isPending}>
      <View style={styles.header}>
        <Avatar.Image
          size={70}
          source={{ uri: avatar }}
        />
        <Text style={[styles.fullName, { color: colors.text }]}>
          {username}
        </Text>
        <Text style={[styles.username, { color: colors.icon }]}>
          {`${firstName} ${lastName}`}
        </Text>
        <Text style={[styles.dateJoined, { color: colors.text }]}>
          {dateJoined}
        </Text>
      </View>
      <View style={styles.statsGroup}>
        <View
          style={[
            styles.stats,
            { backgroundColor: colors.card, width: "30%" },
          ]}>
          <Text style={[styles.statsTitle, { color: colors.green }]}>Wins</Text>
          <Text style={[styles.statsData, { color: colors.text }]}>{wins}</Text>
        </View>
        <View
          style={[
            styles.stats,
            { backgroundColor: colors.card, width: "30%" },
          ]}>
          <Text style={[styles.statsTitle, { color: colors.yellow }]}>
            Draws
          </Text>
          <Text style={[styles.statsData, { color: colors.text }]}>
            {draws}
          </Text>
        </View>
        <View
          style={[
            styles.stats,
            { backgroundColor: colors.card, width: "30%" },
          ]}>
          <Text style={[styles.statsTitle, { color: colors.red }]}>Losses</Text>
          <Text style={[styles.statsData, { color: colors.text }]}>
            {losses}
          </Text>
        </View>
      </View>
      {games.length > 0 ? (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent games
          </Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Time</DataTable.Title>
              <DataTable.Title>Opponent</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>
            {games.map(({ challenger, opponent, winner, duration }, idx) => {
              const color =
                winner === id
                  ? colors.green
                  : winner === null
                  ? colors.yellow
                  : colors.red;
              const status =
                winner === id ? "Won" : winner === null ? "Draw" : "Lost";
              return (
                <DataTable.Row key={idx}>
                  <DataTable.Cell>{duration}</DataTable.Cell>
                  <DataTable.Cell>
                    {challenger.id === id
                      ? opponent.username
                      : challenger.username}
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      color,
                      fontWeight: "600",
                    }}>
                    {status}
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        </>
      ) : (
        <Text>No games yet</Text>
      )}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Friends</Text>
      <View
        style={{
          marginBottom: insets.bottom,
        }}>
        {friends.map((friend) => (
          <FriendItem
            key={friend.id}
            user={friend}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
  },
  fullName: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 12,
  },
  username: {
    fontSize: 18,
    marginTop: 8,
  },
  dateJoined: {
    marginTop: 8,
    fontSize: 15,
  },
  statsGroup: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 12,
    marginVertical: 16,
  },
  stats: {
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  statsData: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "500",
    alignSelf: "flex-start",
    margin: 12,
  },
});
