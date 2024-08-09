import { StyleSheet, Text, View } from "react-native";
import { Avatar, DataTable } from "react-native-paper";
import { useAppTheme } from "@/providers";
import {
  useUserById,
  useFriendsByUserId,
  useGamesByUserId,
} from "@/queries/users";
import { useLocalSearchParams } from "expo-router";
import { FriendItem, GameStats, ScreenContainer } from "@/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import dayjs from "dayjs";

export default function User() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id ? parseInt(params.id) : 0;

  const {
    data: user,
    isPending: isLoadingUser,
    isSuccess: isSuccessUser,
  } = useUserById(id);
  const {
    data: friends,
    isPending: isLoadingFriends,
    isSuccess: isSuccessFriends,
  } = useFriendsByUserId(id);
  const {
    data: games,
    isPending: isLoadingGames,
    isSuccess: isSuccessGames,
  } = useGamesByUserId(id);

  if (
    isLoadingUser ||
    !isSuccessUser ||
    isLoadingFriends ||
    !isSuccessFriends ||
    isLoadingGames ||
    !isSuccessGames
  ) {
    return null;
  }

  const {
    username,
    firstName,
    lastName,
    avatar,
    joinedAt,
    wins,
    losses,
    draws,
  } = user;

  return (
    <ScreenContainer scrollable>
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
          Joined {dayjs(joinedAt).format("D MMMM YYYY")}
        </Text>
      </View>
      <GameStats {...{ draws, losses, wins }} />
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
            {games.map(({ opponent, winner, duration }, idx) => {
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
                  <DataTable.Cell>{opponent.username}</DataTable.Cell>
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "500",
    alignSelf: "flex-start",
    margin: 12,
  },
});
