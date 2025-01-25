import React, { memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { Avatar, Divider } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme, useCurrentUserProfile } from "@/contexts";
import { useSendChallenge } from "@/queries/games";
import { User } from "@/models";
import { Button } from "./Button";
import { useAddFriend } from "@/queries/friends";

type Props = {
  user: Omit<User, "email" | "joinedAt" | "wins" | "losses" | "draws">;
};

export const UserItem = memo(
  ({
    user: { id, username, firstName, lastName, avatar, isFriend, isRequested },
  }: Props) => {
    const { colors } = useAppTheme();
    const profile = useCurrentUserProfile();
    const { mutate: sendChallenge } = useSendChallenge();
    const { mutate: addFriend } = useAddFriend();

    const handleAdd = useCallback(() => {
      addFriend(id);
    }, [addFriend, id]);

    const handleChallenge = useCallback(() => {
      sendChallenge(username);
    }, [sendChallenge, username]);

    return (
      <Link href={`/users/${id}`} asChild>
        <TouchableOpacity>
          <View style={styles.content}>
            <Avatar.Image
              // @ts-ignore
              source={{ uri: avatar }}
              size={38}
            />
            <Text
              testID="fullName"
              style={[styles.name, { color: colors.text }]}
            >{`${firstName} ${lastName}`}</Text>
            {isFriend ? (
              <>
                <Link accessibilityRole="link" href={`/chats/${id}`} asChild>
                  <Ionicons.Button
                    name="mail-outline"
                    size={22}
                    color={colors.icon}
                    iconStyle={styles.messageIcon}
                    backgroundColor="transparent"
                    onPress={() => console.log("Message pressed")}
                    underlayColor="transparent"
                  />
                </Link>
                <Button
                  mode="text"
                  labelStyle={{ fontSize: 14 }}
                  onPress={handleChallenge}
                >
                  Challenge
                </Button>
              </>
            ) : isRequested ? (
              <Ionicons
                name="checkmark-done-sharp"
                color={colors.tint}
                size={22}
              />
            ) : id !== profile.id ? (
              <Button
                mode="contained"
                style={styles.addButton}
                labelStyle={styles.addButtonTitle}
                onPress={handleAdd}
              >
                Add
              </Button>
            ) : null}
          </View>
          <Divider />
        </TouchableOpacity>
      </Link>
    );
  },
);

const styles = StyleSheet.create({
  content: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    marginHorizontal: 12,
  },
  messageIcon: {
    marginRight: 0,
  },
  addButton: {
    height: undefined,
  },
  addButtonTitle: {
    fontSize: 14,
  },
});
