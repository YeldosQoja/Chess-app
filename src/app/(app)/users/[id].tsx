import { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";
import {
  useUserById,
  useFriendsByUserId,
  useGamesByUserId,
} from "@/queries/users";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import dayjs from "dayjs";
import {
  FriendItem,
  GameStats,
  ScreenContainer,
  GameArchiveItem,
  Button,
} from "@/components";
import { useAppTheme } from "@/providers";
import { useSignOut } from "@/queries/auth";

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
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

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
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={70}
          // @ts-ignore
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
      {games.length > 0 && (
        <>
          <TouchableOpacity style={{ backgroundColor: colors.card }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Games
            </Text>
          </TouchableOpacity>
          <View style={{ marginBottom: 12 }}>
            {games.map((game) => (
              <GameArchiveItem key={game.id} game={game} />
            ))}
          </View>
        </>
      )}
      {friends.length > 0 && (
        <>
          <View style={{ backgroundColor: colors.card }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Friends
            </Text>
          </View>
          <View
            style={{
              marginBottom: insets.bottom,
            }}
          >
            {friends.map((friend) => (
              <FriendItem key={friend.id} user={friend} />
            ))}
          </View>
        </>
      )}
      <Button
        mode="text"
        textColor={colors.red}
        style={[styles.logoutButton, { borderColor: colors.red }]}
        onPress={handleSignOut}
        loading={isSigningOut}
      >
        Log out
      </Button>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  header: {
    alignItems: "center",
    padding: 12,
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
    fontSize: 20,
    fontWeight: "600",
    alignSelf: "flex-start",
    margin: 16,
    marginVertical: 8,
  },
  logoutButton: {
    width: "60%",
    alignSelf: "center",
  },
});
