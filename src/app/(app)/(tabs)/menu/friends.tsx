import { useState } from "react";
import { ListRenderItem } from "react-native";
import { FriendList, FriendListItem, ScreenContainer } from "@/components";
import { useFriends } from "@/queries/friends";

export default function Friends() {
  const [query, setQuery] = useState("");
  const { data, isPending, error } = useFriends();
  const renderItem: ListRenderItem<any> = ({ item: { first_name, last_name }, index }) => {
    return (
      <FriendListItem
        fullName={`${first_name} ${last_name}`}
        friendId={3}
        onChallenge={() => null}
      />
    );
  };

  console.log(error);

  return (
    <ScreenContainer isLoading={isPending}>
      <FriendList
        data={data}
        renderItem={renderItem}
        searchBarProps={{
          value: query,
          onChangeText: setQuery,
        }}
      />
    </ScreenContainer>
  );
}
